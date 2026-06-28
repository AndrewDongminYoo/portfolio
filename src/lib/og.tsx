import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { homepage, myName } from '@/lib/constants';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

type LoadedFont = {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: 'normal';
};

const fontFile = (file: string) => join(process.cwd(), 'public/fonts', file);

let fontCache: LoadedFont[] | null = null;

/**
 * Load the bundled Noto Sans KR subsets (Latin + Korean, weights 400/700) for
 * Satori. Cached across invocations within a single server instance.
 */
async function loadFonts(): Promise<LoadedFont[]> {
  if (fontCache) return fontCache;

  const [latin400, korean400, latin700, korean700] = await Promise.all([
    readFile(fontFile('noto-sans-kr-latin-400-normal.woff')),
    readFile(fontFile('noto-sans-kr-korean-400-normal.woff')),
    readFile(fontFile('noto-sans-kr-latin-700-normal.woff')),
    readFile(fontFile('noto-sans-kr-korean-700-normal.woff')),
  ]);

  fontCache = [
    { name: 'Noto Sans KR', data: latin400, weight: 400, style: 'normal' },
    { name: 'Noto Sans KR', data: korean400, weight: 400, style: 'normal' },
    { name: 'Noto Sans KR', data: latin700, weight: 700, style: 'normal' },
    { name: 'Noto Sans KR', data: korean700, weight: 700, style: 'normal' },
  ];
  return fontCache;
}

const clamp = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

export type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

/**
 * Render a 1200×630 social card for the portfolio. Shared by the `/posts` and
 * `/repos` `opengraph-image` routes so every shareable page gets a branded card.
 */
export async function renderOgImage({ eyebrow, title, subtitle }: OgCardProps) {
  const fonts = await loadFonts();

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        backgroundColor: '#0b1120',
        backgroundImage:
          'radial-gradient(900px circle at 0% 0%, rgba(56,189,248,0.18), transparent 45%)',
        color: '#e2e8f0',
        fontFamily: 'Noto Sans KR',
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
            color: '#38bdf8',
          }}>
          {clamp(eyebrow, 40)}
        </div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, lineHeight: 1.15 }}>
          {clamp(title, 60)}
        </div>
        {subtitle ? (
          <div style={{ display: 'flex', fontSize: 32, lineHeight: 1.4, color: '#94a3b8' }}>
            {clamp(subtitle, 120)}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>{myName}</div>
        <div style={{ display: 'flex', fontSize: 24, color: '#64748b' }}>
          {homepage.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  );
}
