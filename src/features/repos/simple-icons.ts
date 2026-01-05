import { getSpec } from '@/features/repos/specs';

type SimpleIconInfo = {
  title: string;
  slug: string;
  /**
   * normalized hex with '#', e.g. '#3178C6'
   * (Same as `color` in most cases; kept for compatibility.)
   */
  hex?: string;
  /**
   * final display color with '#'
   */
  color?: string;
  url: string;
};

const ensureHash = (hex?: string): string | undefined => {
  if (!hex) return undefined;
  const v = hex.trim();
  if (!v) return undefined;
  return v.startsWith('#') ? v : `#${v}`;
};

export const getSimpleIcon = (language?: string | null): SimpleIconInfo | null => {
  if (!language) return null;

  const spec = getSpec(language);
  if (!spec) return null;

  const icon = spec.icon;

  // Prefer linguist color(spec.color), fallback to icon.hex
  const color = ensureHash(spec.color) ?? ensureHash(icon?.hex);
  const hex = color;

  // If there is neither icon nor color, nothing useful to render
  if (!icon && !color) return null;

  return {
    title: spec.title ?? language,
    slug: icon?.slug ?? '',
    hex,
    color,
    url: icon?.url ?? '',
  };
};
