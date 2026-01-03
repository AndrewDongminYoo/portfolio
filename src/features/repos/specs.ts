import type { Specification, SpecificationsFile } from '@/interface/specifications';

import specificationsData from '../../../public/specifications.json';

const specs = specificationsData as SpecificationsFile;

const toKey = (value: string) => value.trim().toLowerCase();

const specIndex = new Map<string, Specification>();

const addKey = (value: string | undefined, spec: Specification) => {
  if (!value) return;
  const key = toKey(value);
  if (!key) return;
  if (!specIndex.has(key)) specIndex.set(key, spec);
};

// Build index once at module load.
Object.values(specs.items).forEach((spec) => {
  addKey(spec.key, spec);
  addKey(spec.title, spec);
  addKey(spec.icon?.slug, spec);

  // Linguist aliases
  spec.language.aliases?.forEach((a) => addKey(a, spec));

  // Also index by exact title variants (optional safety)
  // e.g. "Objective-C" vs "objective-c"
  addKey(spec.title.replace(/\s+/g, ''), spec);
});

export const getSpec = (name?: string | null): Specification | null => {
  if (!name) return null;
  return specIndex.get(toKey(name)) ?? null;
};

export const isProgrammingLanguage = (name: string): boolean => {
  const spec = getSpec(name);
  return spec?.language.type === 'programming';
};

export const getSpecificationsMeta = () => specs.meta;
