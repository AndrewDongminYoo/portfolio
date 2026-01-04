import { describe, expect, it } from 'vitest';

import type Repository from '@/interface/repos';
import {
  getRepoScore,
  sortRepositoriesByPushedAt,
  sortRepositoriesByScoreOnly,
  sortRepositoriesDefault,
} from '@/lib/repo-sort';

const baseRepo: Repository = {
  node_id: '1',
  name: 'repo',
  full_name: 'owner/repo',
  private: false,
  owner: { login: 'owner', avatar_url: '' },
  html_url: 'https://example.com',
  description: 'desc',
  languages_url: 'https://example.com/lang',
  pushed_at: '2024-01-01T00:00:00Z',
  size: 0,
  stargazers_count: 0,
  watchers_count: 0,
  language: 'TypeScript',
  forks_count: 0,
  languages: {},
};

const makeRepo = (overrides: Partial<Repository>): Repository => ({
  ...baseRepo,
  ...overrides,
});

describe('repo-sort', () => {
  it('computes repo score by weights', () => {
    const repo = makeRepo({ stargazers_count: 2, watchers_count: 3, forks_count: 1 });
    expect(getRepoScore(repo)).toBe(2 * 3 + 3 * 1 + 1 * 2);
  });

  it('sorts by pushed_at desc', () => {
    const older = makeRepo({ node_id: 'old', pushed_at: '2023-01-01T00:00:00Z' });
    const newer = makeRepo({ node_id: 'new', pushed_at: '2024-01-01T00:00:00Z' });

    const sorted = sortRepositoriesByPushedAt([older, newer]);

    expect(sorted[0].node_id).toBe('new');
    expect(sorted[1].node_id).toBe('old');
  });

  it('sorts by score only desc', () => {
    const low = makeRepo({ node_id: 'low', stargazers_count: 1 });
    const high = makeRepo({ node_id: 'high', stargazers_count: 5 });

    const sorted = sortRepositoriesByScoreOnly([low, high]);

    expect(sorted[0].node_id).toBe('high');
    expect(sorted[1].node_id).toBe('low');
  });

  it('sorts default with pinned first and ties by pushed_at desc', () => {
    const pinnedA = makeRepo({
      node_id: 'pinned-a',
      stargazers_count: 3,
      watchers_count: 1,
      forks_count: 1, // score 12
      pushed_at: '2024-01-02T00:00:00Z',
    });
    const pinnedB = makeRepo({
      node_id: 'pinned-b',
      stargazers_count: 3,
      watchers_count: 1,
      forks_count: 1, // score 12
      pushed_at: '2024-01-03T00:00:00Z',
    });
    const other = makeRepo({
      node_id: 'other',
      stargazers_count: 1, // score 3
      pushed_at: '2024-01-10T00:00:00Z',
    });

    const sorted = sortRepositoriesDefault([other, pinnedA, pinnedB]);

    expect(sorted[0].node_id).toBe('pinned-b');
    expect(sorted[1].node_id).toBe('pinned-a');
    expect(sorted[2].node_id).toBe('other');
  });
});
