import simpleIconsData from '../../../public/simple-icons.json';

type SimpleIconAliases = {
  aka?: string[];
  old?: string[];
  dup?: Array<{ title: string }>;
  loc?: Record<string, string>;
};

type SimpleIconEntry = {
  title: string;
  slug: string;
  hex: string;
  aliases?: SimpleIconAliases;
};

export type SimpleIconInfo = {
  title: string;
  slug: string;
  hex: string;
  color: string;
  url: string;
};

const SIMPLE_ICON_BASE_URL = 'https://simpleicons.org/icons';
const simpleIcons = simpleIconsData as SimpleIconEntry[];
const iconIndex = new Map<string, SimpleIconEntry>();

const toKey = (value: string) => value.trim().toLowerCase();

const addKey = (value: string | undefined, entry: SimpleIconEntry) => {
  if (!value) return;
  const key = toKey(value);
  if (!key) return;
  if (!iconIndex.has(key)) {
    iconIndex.set(key, entry);
  }
};

simpleIcons.forEach((entry) => {
  addKey(entry.title, entry);
  addKey(entry.slug, entry);
  const aliases = entry.aliases;
  aliases?.aka?.forEach((value) => addKey(value, entry));
  aliases?.old?.forEach((value) => addKey(value, entry));
  aliases?.dup?.forEach((dup) => addKey(dup.title, entry));
  if (aliases?.loc) {
    Object.values(aliases.loc).forEach((value) => addKey(value, entry));
  }
});

export const getSimpleIcon = (language?: string | null): SimpleIconInfo | null => {
  if (!language) return null;
  const entry = iconIndex.get(toKey(language));
  if (!entry) return null;
  const hex = entry.hex;
  const color = hex ? `#${hex}` : '';
  return {
    title: entry.title,
    slug: entry.slug,
    hex,
    color,
    url: `${SIMPLE_ICON_BASE_URL}/${entry.slug}.svg`,
  };
};
