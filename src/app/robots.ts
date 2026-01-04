import type { MetadataRoute } from 'next';

import { homepage } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  const host = homepage.replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      // 상세 페이지(디렉터리)는 허용
      allow: ['/', '/repos/'],
      // 인덱스(/posts)만 차단. 트레일링 슬래시 변형도 함께 차단
      disallow: [
        '/_next/static/chunks',
        '/_next/static/media',
        '/_next/static/css',
        '/_next/static/',
        '/api/insights',
        '/api/insights/*',
        '/insights',
        '/insights/',
        '/posts/*',
        '/styles',
      ],
    },
    // src/app/sitemap.ts
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
