import { describe, expect, it } from 'vitest';

import {
  buildLanguageDistribution,
  type ContributionRepo,
} from '@/components/contributions/shared';

const makeRepo = (
  nameWithOwner: string,
  language: string | undefined,
  total: number,
): ContributionRepo => ({
  nameWithOwner,
  url: `https://github.com/${nameWithOwner}`,
  owner: { login: nameWithOwner.split('/')[0], avatarUrl: '', url: '' },
  language,
  stars: 0,
  forks: 0,
  watchers: 0,
  topics: [],
  total,
  breakdown: { commits: total, issues: 0, pullRequests: 0, reviews: 0 },
});

describe('buildLanguageDistribution', () => {
  it('aggregates language weights by contribution total and sorts descending', () => {
    const repos = [
      makeRepo('a/one', 'TypeScript', 30),
      makeRepo('a/two', 'TypeScript', 10),
      makeRepo('a/three', 'Dart', 20),
    ];

    const { stats, entries, total } = buildLanguageDistribution(repos);

    expect(total).toBe(60);
    expect(entries).toEqual([
      ['TypeScript', 40],
      ['Dart', 20],
    ]);
    expect(stats[0]).toMatchObject({ language: 'TypeScript', value: 40 });
    expect(Math.round(stats[0].percent)).toBe(67);
  });

  it('ignores repos without a recognized programming language', () => {
    const repos = [makeRepo('a/code', 'Kotlin', 5), makeRepo('a/no-lang', undefined, 99)];

    const { stats, total } = buildLanguageDistribution(repos);

    expect(total).toBe(5);
    expect(stats.map((s) => s.language)).toEqual(['Kotlin']);
  });

  it('respects the limit and returns an empty distribution when there is no weight', () => {
    expect(buildLanguageDistribution([]).stats).toEqual([]);

    const repos = [
      makeRepo('a/1', 'TypeScript', 4),
      makeRepo('a/2', 'Dart', 3),
      makeRepo('a/3', 'Kotlin', 2),
    ];
    expect(buildLanguageDistribution(repos, 2).stats).toHaveLength(2);
  });
});
