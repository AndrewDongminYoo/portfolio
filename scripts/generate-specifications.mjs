// scripts/generate-specifications.mjs
//
// Remote-driven slim specifications generator.
// - Fetches linguist languages.yml (YAML) each run
// - Fetches simple-icons.json (JSON) each run
// - Outputs public/specifications.json (deterministic)
//
// Output guarantees:
// - icon is ALWAYS present: SpecIcon | null
// - colors normalized to "#rrggbb" (lowercase) when present
// - SpecLanguage fields only:
//   type, extensions, filenames, language_id, aliases, color
//
// Usage:
//   node scripts/generate-specifications.mjs
//   node scripts/generate-specifications.mjs --only-used
//   node scripts/generate-specifications.mjs --only-used --repos-dir data/repos

import fs from 'node:fs/promises';
import path from 'node:path';

import { load as yamlLoad } from 'js-yaml';

const OUT = 'public/specifications.json';

// Remote sources
const LINGUIST_YML_URL =
  'https://raw.githubusercontent.com/github-linguist/linguist/refs/heads/main/lib/linguist/languages.yml';
const SIMPLE_ICONS_JSON_URL =
  'https://raw.githubusercontent.com/simple-icons/simple-icons/refs/heads/master/data/simple-icons.json';

const SIMPLE_ICON_BASE_URL = 'https://simpleicons.org/icons';

// ---------------- CLI ----------------
const argv = process.argv.slice(2);
const hasFlag = (flag) => argv.includes(flag);
const getArg = (name, fallback) => {
  const idx = argv.indexOf(name);
  if (idx === -1) return fallback;
  return argv[idx + 1] ?? fallback;
};

const ONLY_USED = hasFlag('--only-used');
const REPOS_DIR = getArg('--repos-dir', 'data/repos');

// ---------------- utils ----------------
const normalizeKey = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[’']/g, '')
    // keep + # . for c++, c#, node.js
    .replace(/[^a-z0-9#+.]+/g, ' ')
    .trim();

const toSlugKey = (s) => normalizeKey(s).replace(/\s+/g, '-');

const toIconUrl = (slug) => `${SIMPLE_ICON_BASE_URL}/${slug}.svg`;

/**
 * Normalize any hex-ish input into "#rrggbb" (lowercase).
 * Accepts "#RRGGBB" or "RRGGBB". Rejects non-6-digit.
 */
const toHexColor = (value) => {
  if (!value) return undefined;
  let v = String(value).trim();
  if (!v) return undefined;

  if (v.startsWith('#')) v = v.slice(1);
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return undefined;

  return `#${v.toLowerCase()}`;
};

async function fetchText(url, { timeoutMs = 20000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // GitHub raw occasionally behaves better with a UA
        'User-Agent': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'Accept':
          'text/html,application/xml,application/json;q=0.9,;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${res.statusText} (${url})`);
    }
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

// ---------------- icon matching ----------------
//
// normalize(language-name) -> simple-icons slug
const OVERRIDE_SLUG = {
  // practical mappings (language name -> widely used icon brand)
  // This fixes your current "HTML" miss.
  'html': 'html5',

  // Java is tricky: Simple Icons often has "OpenJDK" rather than "Java" logo.
  // Choose one and be consistent.
  'java': 'openjdk',

  // Objective-C and Objective-C++ uses plain C/C++ icons commonly.
  'objective c': 'C',
  'objective c++': 'C++',
};

// ---------------- only-used filter ----------------
async function loadUsedSet() {
  if (!ONLY_USED) return null;

  try {
    const files = await fs.readdir(REPOS_DIR);
    const used = new Set();

    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      const raw = await fs.readFile(path.join(REPOS_DIR, f), 'utf8');
      const repo = JSON.parse(raw);

      const langs = repo?.languages ?? {};
      Object.keys(langs).forEach((k) => used.add(k));

      if (typeof repo?.language === 'string') used.add(repo.language);

      if (typeof repo?.framework === 'string') used.add(repo.framework);
      if (Array.isArray(repo?.topics)) repo.topics.forEach((t) => used.add(String(t)));
    }

    return used;
  } catch {
    // If repos dir doesn't exist, fallback to no filter
    return null;
  }
}

// --------- Icon index ---------
function buildIconIndex(simpleIcons) {
  const index = new Map(); // normalized key -> entry

  const add = (k, entry) => {
    const nk = normalizeKey(k);
    if (!nk) return;
    if (!index.has(nk)) index.set(nk, entry);
  };

  for (const entry of simpleIcons) {
    add(entry.title, entry);
    add(entry.slug, entry);

    const a = entry.aliases;
    a?.aka?.forEach((v) => add(v, entry));
    a?.old?.forEach((v) => add(v, entry));
    a?.dup?.forEach((d) => add(d.title, entry));
    if (a?.loc) Object.values(a.loc).forEach((v) => add(v, entry));
  }

  return index;
}

function pickIconForLanguage({ name, langMeta, iconIndex }) {
  const n = normalizeKey(name);

  // 1) override
  const override = OVERRIDE_SLUG[n];
  if (override) {
    const hit = iconIndex.get(normalizeKey(override));
    if (hit) return { entry: hit, via: 'override', value: override };
  }

  // 2) direct name/title/slug/aka
  const direct = iconIndex.get(n);
  if (direct) return { entry: direct, via: 'title', value: n };

  // 3) linguist aliases
  if (Array.isArray(langMeta?.aliases)) {
    for (const a of langMeta.aliases) {
      const hit = iconIndex.get(a);
      if (hit) return { entry: hit, via: 'alias', value: a };
    }
  }

  console.debug(`No icon match for language: ${name}`);
  console.debug(`Metadata: ${JSON.stringify(langMeta)}`);
  return { entry: null, via: 'none', value: undefined };
}

// ---------------- main ----------------
async function run() {
  const used = await loadUsedSet();

  const [linguistYml, simpleIconsRaw] = await Promise.all([
    fetchText(LINGUIST_YML_URL),
    fetchText(SIMPLE_ICONS_JSON_URL),
  ]);

  /** @type {Record<string, any>} */
  const languages = yamlLoad(linguistYml, { onWarning: (e) => console.error(e) });
  /** @type {any[]} */
  const simpleIcons = JSON.parse(simpleIconsRaw);

  if (!languages || typeof languages !== 'object') {
    throw new Error('Failed to parse linguist YAML into an object.');
  }
  if (!Array.isArray(simpleIcons)) {
    throw new Error('Failed to parse simple-icons JSON into an array.');
  }

  const iconIndex = buildIconIndex(simpleIcons);

  const languageNames = Object.keys(languages).sort((a, b) => a.localeCompare(b));

  let matched = 0;
  let unmatched = 0;

  const pairs = [];

  for (const name of languageNames) {
    if (used && !used.has(name)) continue;

    const meta = languages[name];

    const { entry, via, value } = pickIconForLanguage({
      name,
      langMeta: meta,
      iconIndex,
    });

    const linguistColor = toHexColor(meta?.color);
    const iconHex = toHexColor(entry?.hex);

    const finalColor = linguistColor ?? iconHex;

    if (entry) matched += 1;
    else unmatched += 1;

    const key = toSlugKey(name);
    const slug = toSlugKey(entry.slug ?? entry.title);
    const icon = entry
      ? {
          hex: iconHex, // "#rrggbb" | undefined
          slug: slug,
          ...(entry.source ? { source: entry.source } : {}),
          url: toIconUrl(slug),
        }
      : null; // ✅ always present as null when missing

    const spec = {
      key,
      title: name,
      kind: 'language',
      color: finalColor, // "#rrggbb" | undefined
      icon, // SpecIcon | null
      language: {
        ...(Array.isArray(meta.aliases) ? { aliases: meta.aliases } : {}),
        color: linguistColor,
        ...(Array.isArray(meta.extensions) ? { extensions: meta.extensions } : {}),
        ...(Array.isArray(meta.filenames) ? { filenames: meta.filenames } : {}),
        ...(typeof meta.language_id === 'number' ? { language_id: meta.language_id } : {}),
        type: meta.type,
      },
      match: {
        ...(value ? { value } : {}),
        via,
      },
    };

    pairs.push([key, spec]);
  }

  // Deterministic ordering by key
  pairs.sort((a, b) => a[0].localeCompare(b[0]));

  const items = Object.fromEntries(pairs);

  const out = {
    meta: {
      generatedAt: new Date().toISOString(),
      linguistCount: Object.keys(languages).length,
      matchedCount: matched,
      simpleIconsCount: simpleIcons.length,
      sources: {
        linguist: LINGUIST_YML_URL,
        simpleIcons: SIMPLE_ICONS_JSON_URL,
      },
      unmatchedCount: unmatched,
    },
    items,
  };

  await fs.writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');

  console.log(`✅ generated: ${OUT}`);
  console.log(
    `items=${Object.keys(items).length}, matched=${matched}, unmatched=${unmatched}, onlyUsed=${ONLY_USED}`,
  );

  if (ONLY_USED) {
    const missing = pairs
      .map(([, s]) => s)
      .filter((s) => s.icon === null)
      .map((s) => `${s.title} (key=${s.key}, via=${s.match.via})`);

    if (missing.length) {
      console.log(`\n⚠️  Missing icons (${missing.length}):`);
      missing.slice(0, 50).forEach((m) => console.log(`- ${m}`));
      if (missing.length > 50) console.log(`... +${missing.length - 50} more`);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
