import type { MetadataRoute } from 'next';

import { homepage } from '@/lib/constants';
import { getSortedPostsData } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new URL(homepage.replace(/\/$/, '/'));

  const now = new Date();
  const posts = getSortedPostsData();
  const postsMap: Record<string, string> = {};
  posts.forEach(async (post) => {
    postsMap[post.id] =
      typeof post.description === 'string' ? post.description : post.description.join('\n');
  });

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: new URL('/', base).toString(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: new URL('/posts', base).toString(),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    return {
      url: new URL(`/posts/${post.id}`, base).toString(),
      lastModified: new Date(post.endAt ?? post.startAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    } satisfies MetadataRoute.Sitemap[number];
  });

  return [...staticEntries, ...postEntries];
}
