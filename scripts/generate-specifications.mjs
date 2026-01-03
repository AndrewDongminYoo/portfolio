// scripts/generate-specifications.mjs
//
// Slim + deterministic specifications.json generator.
//
// Changes vs previous:
// - icon is ALWAYS present: SpecIcon | null
// - all hex colors normalized to "#rrggbb" (lowercase)
// - SpecLanguage slim fields only: type, extensions, filenames, language_id, aliases, color
//
// Usage:
//   node scripts/generate-specifications.mjs
//   node scripts/generate-specifications.mjs --only-used
//   node scripts/generate-specifications.mjs --only-used --repos-dir data/repos

import fs from 'node:fs/promises';
import path from 'node:path';

const LANG_INPUT = 'public/languages.json';
const ICON_INPUT = 'public/simple-icons.json';
const OUT = 'public/specifications.json';

const SIMPLE_ICON_BASE_URL = 'https://simpleicons.org/icons';

const argv = process.argv.slice(2);
const hasFlag = (flag) => argv.includes(flag);
const getArg = (name, fallback) => {
  const idx = argv.indexOf(name);
  if (idx === -1) return fallback;
  return argv[idx + 1] ?? fallback;
};

const ONLY_USED = hasFlag('--only-used');
const REPOS_DIR = getArg('--repos-dir', 'data/repos');

// Keep + # . for names like c++, c#, node.js
const normalizeKey = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9#+.]+/g, ' ')
    .trim();

const toSlugKey = (s) => normalizeKey(s).replace(/\s+/g, '-');

const toIconUrl = (slug) => `${SIMPLE_ICON_BASE_URL}/${slug}.svg`;

/**
 * Normalize any hex-ish input into "#rrggbb" (lowercase).
 * - Accepts "#RRGGBB" or "RRGGBB"
 * - Rejects anything not exactly 6 hex chars
 */
const toHexColor = (value) => {
  if (!value) return undefined;
  let v = String(value).trim();
  if (!v) return undefined;

  if (v.startsWith('#')) v = v.slice(1);
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return undefined;

  return `#${v.toLowerCase()}`;
};

// normalize(language-name) -> simple-icons slug
const OVERRIDE_SLUG = {
  'c++': 'cplusplus',
  'c#': 'csharp',
  'f#': 'fsharp',
  'wolfram language': 'wolframlanguage',
  'common lisp': 'commonlisp',
  'common workflow language': 'commonworkflowlanguage',

  // practical mappings (language name -> widely used icon brand)
  // This fixes your current "HTML" miss.
  'html': 'html5',

  // Java is tricky: Simple Icons often has "OpenJDK" rather than "Java" logo.
  // Choose one and be consistent.
  'java': 'openjdk',

  // Objective-C and Objective-C++ uses plain C/C++ icons commonly.
  'objective c': 'c',
  'objective c++': 'cplusplus',
};

// --------- Only-used filter (optional) ---------
async function loadUsedSet() {
  if (!ONLY_USED) return null;

  let files = [];
  try {
    files = await fs.readdir(REPOS_DIR);
  } catch {
    // If repos dir is missing, treat as "no filter"
    return null;
  }

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

  // 2) direct by language name/title
  const direct = iconIndex.get(n);
  if (direct) return { entry: direct, via: 'title', value: name };

  // 3) linguist aliases
  if (Array.isArray(langMeta?.aliases)) {
    for (const a of langMeta.aliases) {
      const hit = iconIndex.get(normalizeKey(a));
      if (hit) return { entry: hit, via: 'alias', value: a };
    }
  }

  return { entry: null, via: 'none', value: undefined };
}

// --------- Main ---------
async function run() {
  const [langRaw, iconRaw] = await Promise.all([
    fs.readFile(LANG_INPUT, 'utf8'),
    fs.readFile(ICON_INPUT, 'utf8'),
  ]);

  const languages = JSON.parse(langRaw);
  const simpleIcons = JSON.parse(iconRaw);

  const used = await loadUsedSet();
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

    const key = entry?.slug ?? toSlugKey(name);

    const icon = entry
      ? {
          hex: iconHex,
          slug: entry.slug,
          ...(entry.source ? { source: entry.source } : {}),
          url: toIconUrl(entry.slug),
        }
      : null;

    const spec = {
      key,
      title: entry?.title ?? name,
      kind: 'language',
      color: finalColor,
      icon, // ✅ always present, SpecIcon | null
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
