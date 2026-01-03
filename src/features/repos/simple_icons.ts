import languagesData from '../../../public/languages.json';
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

type LanguageMeta = {
  color?: string;
  aliases?: string[];
};

export type SimpleIconInfo = {
  title: string;
  slug: string;
  hex: string;
  color?: string;
  url: string;
};

const SIMPLE_ICON_BASE_URL = 'https://simpleicons.org/icons';
const simpleIcons = simpleIconsData as SimpleIconEntry[];
const languagesMeta = languagesData as Record<string, LanguageMeta>;
const iconIndex = new Map<string, SimpleIconEntry>();
const languageColorIndex = new Map<string, string>();

const toKey = (value: string) => value.trim().toLowerCase();

const addKey = (value: string | undefined, entry: SimpleIconEntry) => {
  if (!value) return;
  const key = toKey(value);
  if (!key) return;
  if (!iconIndex.has(key)) {
    iconIndex.set(key, entry);
  }
};

const addLanguageKey = (value: string | undefined, color: string) => {
  if (!value) return;
  const key = toKey(value);
  if (!key) return;
  if (!languageColorIndex.has(key)) {
    languageColorIndex.set(key, color);
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

Object.entries(languagesMeta).forEach(([name, meta]) => {
  const color = meta?.color;
  if (!color) return;
  addLanguageKey(name, color);
  meta.aliases?.forEach((alias) => addLanguageKey(alias, color));
});

export const getSimpleIcon = (language?: string | null): SimpleIconInfo | null => {
  if (!language) return null;
  const key = toKey(language);
  const entry = iconIndex.get(key);
  const colorFromLanguage = languageColorIndex.get(key);
  const hexFromIcon = entry?.hex;
  const color = colorFromLanguage ?? (hexFromIcon ? `#${hexFromIcon}` : undefined);
  if (!entry && !color) return null;
  const hex = hexFromIcon ?? (color ? color.replace(/^#/, '') : '');
  return {
    title: entry?.title ?? language,
    slug: entry?.slug ?? '',
    hex,
    color,
    url: entry ? `${SIMPLE_ICON_BASE_URL}/${entry.slug}.svg` : '',
  };
};
