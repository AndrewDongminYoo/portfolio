import type { CSSProperties } from 'react';

import type { ContributionRepo } from '@/components/contributions/shared';
import { getSimpleIcon } from '@/features/repos/simple-icons';

const SAFE_ICON_HOSTS = new Set<string>(['simpleicons.org', 'cdn.simpleicons.org']);

const toSafeCssUrl = (raw?: string) => {
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return undefined;
    if (!SAFE_ICON_HOSTS.has(u.host)) return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
};

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex.startsWith('#')) return undefined;
  const normalized = hex.slice(1);
  if (![3, 6].includes(normalized.length)) return undefined;

  const chunk = normalized.length === 3;
  const toChannel = (value: string) => parseInt(chunk ? value.repeat(2) : value, 16);

  const r = toChannel(normalized.slice(0, chunk ? 1 : 2));
  const g = toChannel(normalized.slice(chunk ? 1 : 2, chunk ? 2 : 4));
  const b = toChannel(normalized.slice(chunk ? 2 : 4, chunk ? 3 : 6));
  const a = Math.min(Math.max(alpha, 0), 1);

  if ([r, g, b].some((v) => Number.isNaN(v))) return undefined;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const getRepoAccentStyle = (repo: ContributionRepo): CSSProperties | undefined => {
  if (!repo.language) return undefined;
  const icon = getSimpleIcon(repo.language);
  const color = icon?.color;
  if (!color) return undefined;

  const line = hexToRgba(color, 0.5);
  if (!line) return undefined;

  return { boxShadow: `inset -3px 0 0 0 ${line}` };
};

export const getRepoIconStyle = (repo: ContributionRepo): CSSProperties | undefined => {
  if (!repo.language) return undefined;

  const icon = getSimpleIcon(repo.language);
  if (!icon?.color) return undefined;

  const safeUrl = toSafeCssUrl(icon.url);
  if (!safeUrl) return { backgroundColor: icon.color };

  return {
    backgroundColor: icon.color,
    WebkitMaskImage: `url("${safeUrl}")`,
    maskImage: `url("${safeUrl}")`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  };
};
