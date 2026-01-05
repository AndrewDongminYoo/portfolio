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

  it('detects framework from react-native topics', async () => {
    readFileSync.mockReturnValueOnce(
      JSON.stringify({
        ...baseRepo,
        topics: ['react-native'],
      }),
    );

    const { readData } = await import('@/lib/repos');

    const result = readData('repo');
    expect(result.framework).toBe('React Native');
    expect(result.descriptive_slug).toBe('reactnative');
  });

  it('detects framework from next.js topics', async () => {
    readFileSync.mockReturnValueOnce(
      JSON.stringify({
        ...baseRepo,
        topics: ['nextjs'],
      }),
    );

    const { readData } = await import('@/lib/repos');

    const result = readData('repo');
    expect(result.framework).toBe('Next.js');
    expect(result.descriptive_slug).toBe('nextdotjs');
  });

  it('returns null framework when topics are unrelated', async () => {
    readFileSync.mockReturnValueOnce(
      JSON.stringify({
        ...baseRepo,
        topics: ['unknown'],
        language: 'Dart',
        languages: { Dart: 100 },
      }),
    );

    const { readData } = await import('@/lib/repos');

    const result = readData('repo');
    expect(result.framework).toBeNull();
    expect(result.descriptive_slug).toBe('dart');
  });

  it('returns null for unknown framework title', async () => {
    const { __test__ } = await import('@/lib/repos');

    expect(__test__.brandTitleToFrameworkKey('Svelte' as never)).toBeNull();
  });

  it('infers primary language when repo language is missing', async () => {
    readFileSync.mockReturnValueOnce(
      JSON.stringify({
        ...baseRepo,
        topics: [],
        language: '',
        languages: { TypeScript: 10, JavaScript: 5 },
      }),
    );

    const { readData } = await import('@/lib/repos');

    const result = readData('repo');
    expect(result.framework).toBeNull();
    expect(result.descriptive_slug).toBe('typescript');
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

  it('enriches repository with framework and ecosystems', async () => {
    octokitRequest.mockResolvedValueOnce({
      data: {
        repository: {
          topics: {
            nodes: [{ topic: { name: 'flutter' } }],
          },
          languages: {
            edges: [
              { size: 120, node: { name: 'Dart' } },
              { size: 30, node: { name: 'JavaScript' } },
            ],
          },
          pubspec: {
            __typename: 'Blob',
            isBinary: false,
            text: 'environment:\\n  sdk: flutter\\nflutter:\\n  uses-material-design: true',
          },
          packageJson: {
            __typename: 'Blob',
            isBinary: false,
            text: '{"dependencies":{"next":"13.0.0"}}',
          },
          root: {
            __typename: 'Tree',
            entries: [
              { name: 'pubspec.yaml', type: 'blob' },
              { name: 'yarn.lock', type: 'blob' },
              { name: 'package-lock.json', type: 'blob' },
              { name: 'requirements.txt', type: 'blob' },
            ],
          },
          workflows: {
            __typename: 'Tree',
            entries: [{ name: 'ci.yml', type: 'blob' }],
          },
        },
      },
    });

    const { enrichRepository } = await import('@/lib/repos');

    const result = await enrichRepository({
      ...baseRepo,
      topics: ['custom'],
      default_branch: 'main',
    });

    expect(result.framework).toBe('Flutter');
    expect(result.descriptive_slug).toBe('flutter');
    expect(result.topics).toEqual(expect.arrayContaining(['custom', 'flutter']));
    expect(result.languages).toEqual({ Dart: 120, JavaScript: 30 });
    expect(result.ecosystems).toEqual(
      expect.arrayContaining(['pub', 'Yarn', 'npm', 'pip', 'GitHub Actions workflows']),
    );

    expect(octokitRequest).toHaveBeenCalledWith(
      'POST /graphql',
      expect.objectContaining({
        variables: expect.objectContaining({
          pubspecExpr: 'main:pubspec.yaml',
          packageExpr: 'main:package.json',
        }),
      }),
    );
  });

  it('handles invalid package.json content gracefully', async () => {
    octokitRequest.mockResolvedValueOnce({
      data: {
        repository: {
          topics: { nodes: [{ topic: { name: 'nextjs' } }] },
          languages: { edges: [] },
          pubspec: { __typename: 'Blob', isBinary: true, text: null },
          packageJson: { __typename: 'Blob', isBinary: false, text: '{invalid' },
          root: { __typename: 'Tree', entries: [] },
          workflows: { __typename: 'Tree', entries: [] },
        },
      },
    });

    const { enrichRepository } = await import('@/lib/repos');

    const result = await enrichRepository({
      ...baseRepo,
      topics: [],
      default_branch: 'main',
    });

    expect(result.framework).toBe('Next.js');
    expect(result.descriptive_slug).toBe('nextdotjs');
  });

  it('returns empty signals when repository is missing', async () => {
    octokitRequest.mockResolvedValueOnce({
      data: {
        repository: null,
      },
    });

    const { enrichRepository } = await import('@/lib/repos');

    const result = await enrichRepository({
      ...baseRepo,
      topics: [],
      default_branch: 'main',
    });

    expect(result.framework).toBeNull();
    expect(result.descriptive_slug).toBe('dart');
    expect(result.ecosystems).toEqual([]);
  });

  it('detects ecosystems for RubyGems, Gradle, Bazel, and NuGet', async () => {
    octokitRequest.mockResolvedValueOnce({
      data: {
        repository: {
          topics: { nodes: [] },
          languages: { edges: [] },
          pubspec: { __typename: 'Blob', isBinary: true, text: null },
          packageJson: { __typename: 'Blob', isBinary: true, text: null },
          root: {
            __typename: 'Tree',
            entries: [
              { name: 'Gemfile', type: 'blob' },
              { name: 'build.gradle', type: 'blob' },
              { name: 'WORKSPACE', type: 'blob' },
              { name: 'MyApp.csproj', type: 'blob' },
            ],
          },
          workflows: { __typename: 'Tree', entries: [] },
        },
      },
    });

    const { enrichRepository } = await import('@/lib/repos');

    const result = await enrichRepository({
      ...baseRepo,
      topics: [],
      default_branch: 'main',
    });

    expect(result.ecosystems).toEqual(
      expect.arrayContaining(['RubyGems', 'Gradle', 'Bazel', 'NuGet']),
    );
  });

  it('captures react-native and next.js topics in framework candidates', async () => {
    octokitRequest.mockResolvedValueOnce({
      data: {
        repository: {
          topics: { nodes: [{ topic: { name: 'react-native' } }, { topic: { name: 'nextjs' } }] },
          languages: { edges: [] },
          pubspec: { __typename: 'Blob', isBinary: true, text: null },
          packageJson: { __typename: 'Blob', isBinary: true, text: null },
          root: { __typename: 'Tree', entries: [] },
          workflows: { __typename: 'Tree', entries: [] },
        },
      },
    });

    const { enrichRepository } = await import('@/lib/repos');

    const result = await enrichRepository({
      ...baseRepo,
      topics: [],
      default_branch: 'main',
    });

    const candidateNames = (result.framework_candidates ?? []).map((candidate) => candidate.name);
    expect(candidateNames).toEqual(expect.arrayContaining(['React Native', 'Next.js']));
  });

  it('scans subdirectories when manifest files are missing', async () => {
    octokitRequest
      .mockResolvedValueOnce({
        data: {
          repository: {
            topics: {
              nodes: [{ topic: { name: 'flutter' } }],
            },
            languages: { edges: [] },
            pubspec: { __typename: 'Blob', isBinary: true, text: null },
            packageJson: { __typename: 'Blob', isBinary: true, text: null },
            root: {
              __typename: 'Tree',
              entries: [
                { name: 'apps', type: 'tree' },
                { name: 'pubspec.yaml', type: 'blob' },
              ],
            },
            workflows: { __typename: 'Tree', entries: [] },
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          repository: {
            tree: {
              __typename: 'Tree',
              entries: [{ name: 'package.json', type: 'blob' }],
            },
            pubspec: {
              __typename: 'Blob',
              isBinary: false,
              text: 'flutter:\\n  uses-material-design: true',
            },
            packageJson: {
              __typename: 'Blob',
              isBinary: false,
              text: '{"dependencies":{"react-native":"0.72.0"}}',
            },
          },
        },
      });

    const { enrichRepository } = await import('@/lib/repos');

    const result = await enrichRepository({
      ...baseRepo,
      name: 'mono',
      topics: [],
      default_branch: 'main',
    });

    expect(result.framework).toBe('Flutter');
    expect(result.descriptive_slug).toBe('flutter');
    expect(octokitRequest).toHaveBeenCalledTimes(2);
  });

  it('fetches repository and returns base data on GraphQL failure', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    octokitRequest.mockImplementation((route: string) => {
      if (route === 'GET /repos/{owner}/{repo}') {
        return Promise.resolve({ data: { ...baseRepo, name: 'repo' } });
      }
      if (route === 'POST /graphql') {
        return Promise.reject(new Error('boom'));
      }
      return Promise.reject(new Error('unexpected route'));
    });

    const { fetchRepository } = await import('@/lib/repos');

    const result = await fetchRepository('owner', 'repo');
    expect(result.name).toBe('repo');
    expect(result.framework).toBeUndefined();

    errorSpy.mockRestore();
  });

  it('writes starred repositories to disk', async () => {
    writeFile.mockImplementation((_, __, ___, cb) => {
      if (typeof cb === 'function') cb(null);
    });

    octokitRequest.mockResolvedValueOnce({
      data: [
        { ...baseRepo, name: 'skip-small', size: 100, fork: false, archived: false },
        { ...baseRepo, name: 'skip-fork', size: 5000, fork: true, archived: false },
        { ...baseRepo, name: 'skip-archived', size: 5000, fork: false, archived: true },
        { ...baseRepo, name: 'keep', size: 5000, fork: false, archived: false },
      ],
    });

    const { fetchStarredRepository } = await import('@/lib/repos');

    await fetchStarredRepository();
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(String(writeFile.mock.calls[0][0])).toContain('/data/stars/keep.json');
  });

  it('downloads JSON snapshots for repositories', async () => {
    writeFile.mockImplementation((_, __, ___, cb) => {
      if (typeof cb === 'function') cb(null);
    });

    octokitRequest.mockResolvedValueOnce({
      data: [
        { ...baseRepo, name: 'one', size: 10, fork: false, archived: false, framework: 'Flutter' },
        {
          ...baseRepo,
          name: 'two',
          size: 20,
          fork: false,
          archived: false,
          framework: 'Next.js',
        },
      ],
    });

    const { downloadJSON } = await import('@/lib/repos');

    const count = await downloadJSON();
    expect(count).toBe(2);
    expect(writeFile).toHaveBeenCalledTimes(2);
    expect(String(writeFile.mock.calls[0][0])).toContain('/data/repos/one.json');
    expect(String(writeFile.mock.calls[1][0])).toContain('/data/repos/two.json');
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

  it('rejects tasks in createLimiter when task throws', async () => {
    const { createLimiter } = await import('@/lib/repos');
    const limit = createLimiter(1);

    await expect(
      limit(async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });
});
