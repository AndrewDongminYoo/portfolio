import type { MetadataRoute } from 'next';

import { homepage } from '@/lib/constants';
import { getSortedPostsData } from '@/lib/posts';

function abs(base: string, pathOrUrl: string): string {
  // Absolute http(s)
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  // Root-relative or relative -> resolve against base
  return new URL(pathOrUrl, base).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new URL(homepage.replace(/\/$/, '/'));

  const now = new Date();
  const posts = getSortedPostsData().filter((e) => e.type === 'experience');

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: new URL('/', base).toString(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: new URL('/repos', base).toString(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: new URL('/posts', base).toString(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const images = [post.icon && abs(homepage, post.icon), post.appstore_preview].filter(
      Boolean,
    ) as string[];

    return {
      url: new URL(`/posts/${post.id}`, base).toString(),
      lastModified: new Date(post.endAt ?? post.startAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      images,
    } satisfies MetadataRoute.Sitemap[number];
  });

  return [...staticEntries, ...postEntries];
}
