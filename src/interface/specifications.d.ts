import type { LanguageType } from '@/interface/language';

export type SpecKind = 'language';
export type MatchVia = 'override' | 'slug' | 'title' | 'alias' | 'none';

export interface SpecIcon {
  slug: string;
  url: string;
  /**
   * Hex color. Prefer "#RRGGBB".
   * (We normalize at runtime to support legacy "RRGGBB" too.)
   */
  hex?: string;
  source?: string;
}

export interface SpecLanguage {
  type: LanguageType;
  extensions?: string[];
  filenames?: string[];
  language_id?: number;
  aliases?: string[];
  /**
   * Linguist color. Prefer "#RRGGBB".
   */
  color?: string;
}

export interface Specification {
  key: string;
  title: string;
  kind: SpecKind;
  /**
   * Final display color. Prefer "#RRGGBB".
   * (Typically linguist color, fallback to icon hex)
   */
  color?: string;
  icon: SpecIcon | null;
  language: SpecLanguage;
  match: { via: MatchVia; value?: string };
}

export interface SpecificationsFile {
  meta: {
    generatedAt: string;
    simpleIconsCount: number;
    linguistCount: number;
    matchedCount: number;
    unmatchedCount: number;
  };
  items: Record<string, Specification>;
}
