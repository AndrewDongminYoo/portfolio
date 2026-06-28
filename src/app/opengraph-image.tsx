import { primaryTitle } from '@/lib/constants';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = primaryTitle;

export default async function Image() {
  return await renderOgImage({
    eyebrow: 'PORTFOLIO',
    title: primaryTitle,
    subtitle: 'React Native · Flutter · TypeScript — 모바일 개발자',
  });
}
