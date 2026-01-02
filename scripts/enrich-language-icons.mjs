import fs from 'node:fs/promises';

import * as icons from 'simple-icons';

const INPUT = 'public/languages.json';
const OUTPUT = 'public/languages.with-icons.json';

const toIconUrl = (slug) => `https://simpleicons.org/icons/${slug}.svg`;

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9#+.]+/g, ' ')
    .trim();

// 수동 매핑이 필요한 것들
const OVERRIDE_SLUG = {
  'C++': 'cplusplus',
  'Common Lisp': 'commonlisp',
  'Common Workflow Language': 'commonworkflowlanguage',
  'F#': 'fsharp',
  'Wolfram Language': 'wolframlanguage',
};

function buildIconIndex() {
  // simple-icons exports 중 아이콘 객체만 골라서(title/slug/svg 있는 것들)
  const list = Object.values(icons).filter(
    (v) => v && typeof v === 'object' && 'title' in v && 'slug' in v,
  );

  const byTitle = new Map(); // normalize(title) -> icon
  const bySlug = new Map(); // slug -> icon

  for (const icon of list) {
    bySlug.set(icon.slug, icon);
    byTitle.set(normalize(icon.title), icon);
  }
  return { byTitle, bySlug };
}

function pickIcon({ name, aliases }, index) {
  const n = normalize(name);

  // 1) override
  if (OVERRIDE_SLUG[n]) {
    return index.bySlug.get(OVERRIDE_SLUG[n]) ?? null;
  }

  // 2) exact title match
  const direct = index.byTitle.get(n);
  if (direct) return direct;

  // 3) aliases match (GitHub linguist의 aliases 활용)
  if (Array.isArray(aliases)) {
    for (const a of aliases) {
      const hit = index.byTitle.get(normalize(a));
      if (hit) return hit;
    }
  }

  return null;
}

const run = async () => {
  const raw = await fs.readFile(INPUT, 'utf8');
  const languages = JSON.parse(raw);

  const index = buildIconIndex();

  let hit = 0;
  let miss = 0;

  const out = {};
  for (const [name, meta] of Object.entries(languages)) {
    const icon = pickIcon({ name, aliases: meta.aliases }, index);

    if (icon) {
      hit += 1;
      out[name] = toIconUrl(icon.slug);
    }
  }

  await fs.writeFile(OUTPUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`done: hit=${hit}, miss=${miss}, output=${OUTPUT}`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
