// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const readFileSync = vi.fn();
const readdirSync = vi.fn();
const writeFile = vi.fn();
const octokitRequest = vi.fn();

vi.mock('node:fs', () => ({
  default: {
    readFileSync,
    readdirSync,
    writeFile,
  },
}));

vi.mock('@octokit/core', () => ({
  Octokit: class MockOctokit {
    request = octokitRequest;
  },
}));

const baseRepo = {
  node_id: 'node',
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
  language: 'Dart',
  forks_count: 0,
  languages: {},
};

beforeEach(() => {
  vi.resetModules();
  readFileSync.mockReset();
  readdirSync.mockReset();
  writeFile.mockReset();
  octokitRequest.mockReset();
  process.env.GITHUB_TOKEN = 'test-token';
});

describe('repos helpers', () => {
  it('applies framework from topics when reading data', async () => {
    const repo = { ...baseRepo, topics: ['flutter'] };
    readFileSync.mockReturnValueOnce(JSON.stringify(repo));

    const { readData } = await import('@/lib/repos');

    const result = readData('repo');
    expect(result.framework).toBe('Flutter');
    expect(result.descriptive_slug).toBe('flutter');
  });

  it('reads repositories and sorts via default rules', async () => {
    readdirSync.mockReturnValueOnce(['low.json', 'high.json']);

    readFileSync.mockImplementation((filePath: string) => {
      if (filePath.includes('high.json')) {
        return JSON.stringify({
          ...baseRepo,
          name: 'high',
          stargazers_count: 5,
          watchers_count: 1,
          forks_count: 1,
          pushed_at: '2024-02-01T00:00:00Z',
        });
      }
      return JSON.stringify({
        ...baseRepo,
        name: 'low',
        stargazers_count: 1,
        watchers_count: 0,
        forks_count: 0,
        pushed_at: '2024-03-01T00:00:00Z',
      });
    });

    const { readRepositories } = await import('@/lib/repos');

    const result = readRepositories();
    expect(result[0].name).toBe('high');
    expect(result[1].name).toBe('low');
  });

  it('fills descriptive slug from language when topics are missing', async () => {
    readFileSync.mockReturnValueOnce(
      JSON.stringify({
        ...baseRepo,
        topics: undefined,
        language: 'Dart',
        languages: { Dart: 100 },
      }),
    );

    const { readData } = await import('@/lib/repos');

    const result = readData('repo');
    expect(result.framework).toBeNull();
    expect(result.descriptive_slug).toBe('dart');
  });

  it('fetches repositories with filters and sorting', async () => {
    const makeRaw = (overrides: Record<string, unknown>) => ({
      node_id: 'node',
      name: 'repo',
      full_name: 'owner/repo',
      private: false,
      owner: { login: 'owner', avatar_url: '' },
      html_url: 'https://example.com',
      description: 'desc',
      languages_url: 'https://example.com/lang',
      pushed_at: '2024-01-01T00:00:00Z',
      size: 5000,
      stargazers_count: 0,
      watchers_count: 0,
      language: 'Dart',
      forks_count: 0,
      topics: [],
      fork: false,
      archived: false,
      ...overrides,
    });

    octokitRequest.mockResolvedValueOnce({
      data: [
        makeRaw({ name: 'small', size: 10 }),
        makeRaw({ name: 'forked', fork: true, stargazers_count: 50 }),
        makeRaw({ name: 'archived', archived: true, stargazers_count: 40 }),
        makeRaw({ name: 'popular', stargazers_count: 12, watchers_count: 5, forks_count: 2 }),
        makeRaw({ name: 'less', stargazers_count: 1, watchers_count: 0, forks_count: 0 }),
      ],
    });

    const { fetchRepositories } = await import('@/lib/repos');

    const result = await fetchRepositories({ minSizeKb: 100, includeForks: false });
    expect(result.map((repo) => repo.name)).toEqual(['popular', 'less']);
  });

  it('limits concurrent tasks with createLimiter', async () => {
    const { createLimiter } = await import('@/lib/repos');
    const limit = createLimiter(1);

    let active = 0;
    let maxActive = 0;

    const task = async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
    };

    await Promise.all([limit(task), limit(task), limit(task)]);

    expect(maxActive).toBe(1);
  });
});
