import fs from 'node:fs';
import path from 'node:path';

import { Octokit } from '@octokit/core';
import { type Endpoints } from '@octokit/types';

import type Repository from '@/interface/repos';
import type { Candidate } from '@/interface/repos';
import { type BrandSlug, type BrandTitle, type Ecosystem } from '@/interface/stack';
import { sortRepositoriesDefault } from '@/lib/repo-sort';

const reposDirectory = path.join(process.cwd(), 'data/repos');
const starsDirectory = path.join(process.cwd(), 'data/stars');

const DEFAULT_HEADERS = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
} as const;

// ----------------------------
// Octokit (lazy init) - DO NOT throw at import-time
// ----------------------------

let _octokit: Octokit | null = null;

function getOctokit(): Octokit {
  if (_octokit) return _octokit;

  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) {
    // import 시점이 아닌 "실제 호출 시점"에만 에러
    throw new Error('GITHUB_TOKEN is required.');
  }

  _octokit = new Octokit({ auth: GITHUB_TOKEN });
  return _octokit;
}

// ----------------------------
// Small concurrency limiter (no deps)
// ----------------------------

export function createLimiter(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const tryRunNext = () => {
    if (active >= concurrency) return;
    const job = queue.shift();
    if (!job) return;
    active += 1;
    job();
  };

  return async function limit<T>(task: () => Promise<T>): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      queue.push(async () => {
        try {
          resolve(await task());
        } catch (e) {
          reject(e);
        } finally {
          active -= 1;
          tryRunNext();
        }
      });
      tryRunNext();
    });
  };
}

// ----------------------------
// Types (local)
// ----------------------------

type DetectResult = {
  framework: BrandTitle | null;
  descriptive_slug: BrandSlug | null;
  framework_candidates: Candidate[];
  ecosystems: Ecosystem[];
};

type DetectOptions = {
  minScoreToDecide: number;
};

const DEFAULT_DETECT_OPTIONS: DetectOptions = {
  minScoreToDecide: 80,
};

// ----------------------------
// Framework definitions (internal, type-safe)
// ----------------------------

const FRAMEWORKS = {
  flutter: 'Flutter',
  nextdotjs: 'Next.js',
  reactnative: 'React Native',
} as const;

type FrameworkKey = keyof typeof FRAMEWORKS;
type FrameworkTitle = (typeof FRAMEWORKS)[FrameworkKey];

function frameworkKeyToBrandSlug(key: FrameworkKey): BrandSlug {
  // 프레임워크 slug는 우리가 통제하는 리터럴이므로 “국소적” 캐스팅만 허용
  return key as unknown as BrandSlug;
}

function frameworkTitleToBrandTitle(title: FrameworkTitle): BrandTitle {
  return title as unknown as BrandTitle;
}

function brandTitleToFrameworkKey(title: BrandTitle): FrameworkKey | null {
  const str = String(title);
  for (const [k, v] of Object.entries(FRAMEWORKS) as Array<[FrameworkKey, FrameworkTitle]>) {
    if (v === str) return k;
  }
  return null;
}

// ----------------------------
// Topic heuristics
// ----------------------------

const FLUTTER_TOPICS = new Set(['flutter', 'flutter-plugin', 'flutter-package', 'flutter-app']);
const REACT_NATIVE_TOPICS = new Set(['react-native', 'reactnative', 'expo']);
const NEXT_TOPICS = new Set(['nextjs', 'next.js', 'next-js', 'next']);

// ----------------------------
// Detection utilities
// ----------------------------

function normalizeTopics(topics?: string[]): Set<string> {
  return new Set((topics ?? []).map((t) => t.toLowerCase().trim()).filter(Boolean));
}

function addScore(
  map: Map<FrameworkKey, { score: number; reasons: string[] }>,
  key: FrameworkKey,
  delta: number,
  reason: string,
) {
  const cur = map.get(key) ?? { score: 0, reasons: [] };
  cur.score += delta;
  cur.reasons.push(`${delta >= 0 ? '+' : ''}${delta} ${reason}`);
  map.set(key, cur);
}

function isFlutterPubspec(content: string): boolean {
  return /(^|\n)\s*flutter\s*:\s*(\n|$)/m.test(content) || /\bsdk\s*:\s*flutter\b/i.test(content);
}

function parsePackageJsonDeps(content: string): Record<string, string> {
  const parsed = JSON.parse(content) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
  };
  return {
    ...(parsed.dependencies ?? {}),
    ...(parsed.devDependencies ?? {}),
    ...(parsed.peerDependencies ?? {}),
    ...(parsed.optionalDependencies ?? {}),
  };
}

function detectFrameworksFromPackageJson(content: string): FrameworkKey[] {
  try {
    const deps = parsePackageJsonDeps(content);
    const keys = Object.keys(deps);

    const hits: FrameworkKey[] = [];
    if (deps['react-native'] || deps.expo || keys.some((k) => k.startsWith('@react-native/'))) {
      hits.push('reactnative');
    }
    if (deps.next) hits.push('nextdotjs');

    return hits;
  } catch {
    return [];
  }
}

// ----------------------------
// Language slug fallback
// ----------------------------

const LANGUAGE_TO_SLUG: Record<string, BrandSlug> = {
  'TypeScript': 'typescript' as BrandSlug,
  'JavaScript': 'javascript' as BrandSlug,
  'Dart': 'dart' as BrandSlug,
  'Python': 'python' as BrandSlug,
  'Go': 'go' as BrandSlug,
  'Java': 'java' as BrandSlug,
  'Ruby': 'ruby' as BrandSlug,
  'Rust': 'rust' as BrandSlug,
  'PHP': 'php' as BrandSlug,
  'Swift': 'swift' as BrandSlug,
  'Kotlin': 'kotlin' as BrandSlug,
  'C': 'c' as BrandSlug,
  'C++': 'cplusplus' as BrandSlug,
  'C#': 'csharp' as BrandSlug,
  'Shell': 'gnu-bash' as BrandSlug,
  'HTML': 'html5' as BrandSlug,
  'CSS': 'css3' as BrandSlug,
  'HCL': 'hcl' as BrandSlug,
  'YAML': 'yaml' as BrandSlug,
};

function pickPrimaryLanguageName(
  repo: Repository,
  languageMap: Record<string, number>,
): string | null {
  const primary = String(repo.language ?? '').trim();
  if (primary) return primary;

  let best: { name: string; size: number } | null = null;
  for (const [name, size] of Object.entries(languageMap ?? {})) {
    const s = typeof size === 'number' ? size : 0;
    if (!best || s > best.size) best = { name, size: s };
  }
  return best?.name ?? null;
}

function inferDescriptiveSlug(
  decidedFramework: BrandTitle | null,
  repo: Repository,
  languageMap: Record<string, number>,
): BrandSlug | null {
  if (decidedFramework) {
    const key = brandTitleToFrameworkKey(decidedFramework);
    return key ? frameworkKeyToBrandSlug(key) : null;
  }

  const langName = pickPrimaryLanguageName(repo, languageMap);
  if (!langName) return null;
  return LANGUAGE_TO_SLUG[langName] ?? null;
}

// ----------------------------
// GraphQL signals
// ----------------------------

type GraphQLRepoSignals = {
  repository: null | {
    topics?: {
      nodes?: Array<{ topic?: { name?: string | null } | null } | null> | null;
    } | null;
    languages?: {
      edges?: Array<{ size?: number | null; node?: { name?: string | null } | null } | null> | null;
    } | null;

    pubspec?: { __typename?: string; text?: string | null; isBinary?: boolean | null } | null;
    packageJson?: { __typename?: string; text?: string | null; isBinary?: boolean | null } | null;

    root?: {
      __typename?: string;
      entries?: Array<{ name?: string | null; type?: string | null } | null> | null;
    } | null;

    workflows?: {
      __typename?: string;
      entries?: Array<{ name?: string | null; type?: string | null } | null> | null;
    } | null;
  };
};

type RepoSignals = {
  topics: string[];
  languages: Record<string, number>;
  rootNames: Set<string>; // root entry names + (optional) `${dir}/${name}` paths
  workflowNames: Set<string>;
  pubspecText?: string;
  packageJsonText?: string;
};

async function graphqlRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const octokit = getOctokit();
  const res = await octokit.request('POST /graphql', {
    query,
    variables,
    headers: DEFAULT_HEADERS,
  });

  // @octokit/core returns { data: ... } for graphql, but be defensive
  const payload = res.data as unknown as { data?: T } | T;
  return (
    typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload
  ) as T;
}

const REPO_SIGNALS_QUERY = /* GraphQL */ `
  query RepoSignals(
    $owner: String!
    $name: String!
    $pubspecExpr: String!
    $packageExpr: String!
    $rootExpr: String!
    $workflowsExpr: String!
  ) {
    repository(owner: $owner, name: $name) {
      topics: repositoryTopics(first: 30) {
        nodes {
          topic {
            name
          }
        }
      }

      languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
        edges {
          size
          node {
            name
          }
        }
      }

      pubspec: object(expression: $pubspecExpr) {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }

      packageJson: object(expression: $packageExpr) {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }

      root: object(expression: $rootExpr) {
        __typename
        ... on Tree {
          entries {
            name
            type
          }
        }
      }

      workflows: object(expression: $workflowsExpr) {
        __typename
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
    }
  }
`;

function toLanguagesMap(
  edges:
    | Array<{ size?: number | null; node?: { name?: string | null } | null } | null>
    | null
    | undefined,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of edges ?? []) {
    if (!e?.node?.name) continue;
    out[e.node.name] = typeof e.size === 'number' ? e.size : 0;
  }
  return out;
}

function toNameSet(
  entries: Array<{ name?: string | null } | null> | null | undefined,
): Set<string> {
  const out = new Set<string>();
  for (const e of entries ?? []) {
    const name = e?.name?.trim();
    if (name) out.add(name);
  }
  return out;
}

function toTopicsList(
  nodes: Array<{ topic?: { name?: string | null } | null } | null> | null | undefined,
): string[] {
  const out: string[] = [];
  for (const n of nodes ?? []) {
    const name = n?.topic?.name?.trim();
    if (name) out.push(name);
  }
  return out;
}

function buildBranchExpr(repo: Repository): string {
  const b = String(repo.default_branch ?? '').trim();
  return b || 'HEAD';
}

async function fetchRepoSignals(owner: string, repo: string, branch: string): Promise<RepoSignals> {
  const variables = {
    owner,
    name: repo,
    pubspecExpr: `${branch}:pubspec.yaml`,
    packageExpr: `${branch}:package.json`,
    rootExpr: `${branch}:`,
    workflowsExpr: `${branch}:.github/workflows`,
  };

  const data = await graphqlRequest<GraphQLRepoSignals>(REPO_SIGNALS_QUERY, variables);

  if (!data.repository) {
    return { topics: [], languages: {}, rootNames: new Set(), workflowNames: new Set() };
  }

  const topics = toTopicsList(data.repository.topics?.nodes);
  const languages = toLanguagesMap(data.repository.languages?.edges);

  const rootNames = toNameSet(
    data.repository.root?.__typename === 'Tree' ? data.repository.root.entries : null,
  );
  const workflowNames = toNameSet(
    data.repository.workflows?.__typename === 'Tree' ? data.repository.workflows.entries : null,
  );

  const pubspecText =
    data.repository.pubspec?.__typename === 'Blob' && !data.repository.pubspec.isBinary
      ? (data.repository.pubspec.text ?? undefined)
      : undefined;

  const packageJsonText =
    data.repository.packageJson?.__typename === 'Blob' && !data.repository.packageJson.isBinary
      ? (data.repository.packageJson.text ?? undefined)
      : undefined;

  return { topics, languages, rootNames, workflowNames, pubspecText, packageJsonText };
}

// ----------------------------
// Monorepo limited scan (optional, capped)
// ----------------------------

type GraphQLTreeQueryResult = {
  repository: null | {
    tree?: {
      __typename?: string;
      entries?: Array<{ name?: string | null; type?: string | null } | null> | null;
    } | null;
    pubspec?: { __typename?: string; text?: string | null; isBinary?: boolean | null } | null;
    packageJson?: { __typename?: string; text?: string | null; isBinary?: boolean | null } | null;
  };
};

const SUBDIR_SCAN_QUERY = /* GraphQL */ `
  query SubdirScan(
    $owner: String!
    $name: String!
    $treeExpr: String!
    $pubspecExpr: String!
    $packageExpr: String!
  ) {
    repository(owner: $owner, name: $name) {
      tree: object(expression: $treeExpr) {
        __typename
        ... on Tree {
          entries {
            name
            type
          }
        }
      }

      pubspec: object(expression: $pubspecExpr) {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }

      packageJson: object(expression: $packageExpr) {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }
    }
  }
`;

async function scanOneSubdir(owner: string, repo: string, branch: string, dir: string) {
  const data = await graphqlRequest<GraphQLTreeQueryResult>(SUBDIR_SCAN_QUERY, {
    owner,
    name: repo,
    treeExpr: `${branch}:${dir}`,
    pubspecExpr: `${branch}:${dir}/pubspec.yaml`,
    packageExpr: `${branch}:${dir}/package.json`,
  });

  const entries = toNameSet(
    data.repository?.tree?.__typename === 'Tree' ? data.repository.tree.entries : null,
  );

  const pubspecText =
    data.repository?.pubspec?.__typename === 'Blob' && !data.repository.pubspec.isBinary
      ? (data.repository.pubspec.text ?? undefined)
      : undefined;

  const packageJsonText =
    data.repository?.packageJson?.__typename === 'Blob' && !data.repository.packageJson.isBinary
      ? (data.repository.packageJson.text ?? undefined)
      : undefined;

  return { entries, pubspecText, packageJsonText };
}

// ----------------------------
// Ecosystem inference (files-based)
// ----------------------------

function inferEcosystemsFromFiles(root: Set<string>, workflows: Set<string>): Ecosystem[] {
  // root에는 "pnpm-lock.yaml" 같은 basename도 있고 "apps/pnpm-lock.yaml" 같은 경로도 있을 수 있음
  const rootList = Array.from(root);
  const basenames = new Set(
    rootList.map((p) => path.posix.basename(p.replaceAll('\\', '/'))).filter(Boolean),
  );

  const hasPath = (name: string) => root.has(name) || basenames.has(name);
  const hasPathSuffix = (suffixes: string[]) =>
    rootList.some((p) => suffixes.some((s) => p.endsWith(s) || p.endsWith(`/${s}`)));

  const out = new Set<Ecosystem>();

  if (Array.from(workflows).some((n) => n.endsWith('.yml') || n.endsWith('.yaml'))) {
    out.add('GitHub Actions workflows');
  }

  // Node
  if (hasPath('pnpm-lock.yaml')) out.add('pnpm');
  if (hasPath('yarn.lock')) out.add('Yarn');
  if (hasPath('package-lock.json')) out.add('npm');

  // Dart
  if (hasPath('pubspec.yaml') || hasPath('pubspec.lock')) out.add('pub');

  // Python
  if (hasPath('requirements.txt') || hasPath('Pipfile') || hasPath('Pipfile.lock')) out.add('pip');
  if (hasPath('poetry.lock') || hasPath('pyproject.toml')) out.add('Poetry');

  // Rust
  if (hasPath('Cargo.lock') || hasPath('Cargo.toml')) out.add('Cargo');

  // PHP
  if (hasPath('composer.lock') || hasPath('composer.json')) out.add('Composer');

  // Ruby
  if (hasPath('Gemfile.lock') || hasPath('Gemfile') || hasPathSuffix(['.gemspec']))
    out.add('RubyGems');

  // Go
  if (hasPath('go.mod')) out.add('Go modules');

  // Java
  if (hasPath('pom.xml')) out.add('Maven');
  if (
    hasPath('build.gradle') ||
    hasPath('build.gradle.kts') ||
    hasPath('settings.gradle') ||
    hasPath('settings.gradle.kts')
  ) {
    out.add('Gradle');
  }

  // Bazel
  if (hasPath('WORKSPACE') || hasPath('WORKSPACE.bazel') || hasPath('MODULE.bazel'))
    out.add('Bazel');

  // Terraform/OpenTofu
  if (hasPath('.terraform.lock.hcl')) out.add('OpenTofu');

  // Julia
  if (hasPath('Manifest.toml') || hasPath('Project.toml')) out.add('Julia');

  // Swift
  if (hasPath('Package.resolved') || hasPath('Package.swift')) out.add('Swift Package Manager');

  // NuGet
  if (
    hasPathSuffix(['.csproj', '.fsproj', '.vbproj', '.vcxproj', '.nuspec']) ||
    hasPath('packages.config')
  ) {
    out.add('NuGet');
  }

  return Array.from(out);
}

// ----------------------------
// Framework detection (scored)
// ----------------------------

async function detectFrameworkRich(
  repo: Repository,
  signals: RepoSignals,
  options: DetectOptions = DEFAULT_DETECT_OPTIONS,
): Promise<DetectResult> {
  const scoreMap = new Map<FrameworkKey, { score: number; reasons: string[] }>();

  const mergedTopics = normalizeTopics([...(repo.topics ?? []), ...(signals.topics ?? [])]);

  if ([...FLUTTER_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'flutter', 100, 'topic match');
  if ([...REACT_NATIVE_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'reactnative', 100, 'topic match');
  if ([...NEXT_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'nextdotjs', 100, 'topic match');

  if (signals.pubspecText && isFlutterPubspec(signals.pubspecText)) {
    addScore(scoreMap, 'flutter', 90, 'pubspec.yaml indicates Flutter');
  }

  if (signals.packageJsonText) {
    const hits = detectFrameworksFromPackageJson(signals.packageJsonText);
    if (hits.includes('reactnative'))
      addScore(scoreMap, 'reactnative', 90, 'package.json deps indicate RN');
    if (hits.includes('nextdotjs'))
      addScore(scoreMap, 'nextdotjs', 90, 'package.json deps indicate Next.js');
  }

  const ecosystems = inferEcosystemsFromFiles(signals.rootNames, signals.workflowNames);
  if (ecosystems.includes('pub')) addScore(scoreMap, 'flutter', 15, 'ecosystem: pub present');

  const framework_candidates: Candidate[] = Array.from(scoreMap.entries())
    .map(([key, v]) => ({
      slug: frameworkKeyToBrandSlug(key),
      name: frameworkTitleToBrandTitle(FRAMEWORKS[key]),
      score: v.score,
      reasons: v.reasons,
    }))
    .sort((a, b) => b.score - a.score);

  const top = framework_candidates[0];
  const framework: BrandTitle | null =
    top && top.score >= options.minScoreToDecide ? top.name : null;

  const descriptive_slug = inferDescriptiveSlug(framework, repo, signals.languages);

  return { framework, descriptive_slug, framework_candidates, ecosystems };
}

function detectFrameworkFromTopicsOnly(topics?: string[]): BrandTitle | null {
  if (!topics?.length) return null;
  const normalized = normalizeTopics(topics);

  for (const t of FLUTTER_TOPICS)
    if (normalized.has(t)) return frameworkTitleToBrandTitle('Flutter');
  for (const t of REACT_NATIVE_TOPICS)
    if (normalized.has(t)) return frameworkTitleToBrandTitle('React Native');
  for (const t of NEXT_TOPICS) if (normalized.has(t)) return frameworkTitleToBrandTitle('Next.js');

  return null;
}

// ----------------------------
// “Pick” based shaping (no destructive deletes)
// ----------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickRepository(raw: any): Repository {
  // 런타임 정규화 + 타입 체크는 "satisfies"로, 반환은 Repository로
  const repo = {
    node_id: String(raw.node_id ?? ''),
    name: String(raw.name ?? ''),
    full_name: String(raw.full_name ?? ''),
    private: Boolean(raw.private),
    owner: {
      login: String(raw.owner?.login ?? ''),
      avatar_url: String(raw.owner?.avatar_url ?? ''),
    },
    html_url: String(raw.html_url ?? ''),
    description: String(raw.description ?? ''),
    languages_url: String(raw.languages_url ?? ''),
    pushed_at: String(raw.pushed_at ?? ''),
    size: Number(raw.size ?? 0),
    stargazers_count: Number(raw.stargazers_count ?? 0),
    watchers_count: Number(raw.watchers_count ?? 0),
    language: String(raw.language ?? ''),
    forks_count: Number(raw.forks_count ?? 0),

    // topics/languages
    languages:
      raw.languages && typeof raw.languages === 'object'
        ? (raw.languages as Record<string, number>)
        : ({} as Record<string, number>),
    topics: Array.isArray(raw.topics) ? (raw.topics as string[]) : undefined,

    // enrich fields (optional)
    framework: raw.framework ?? undefined,
    descriptive_slug: raw.descriptive_slug ?? undefined,
    framework_candidates: raw.framework_candidates ?? undefined,
    ecosystems: raw.ecosystems ?? undefined,
  } satisfies Repository;

  return repo;
}

/**
 * 오프라인: topics 기반으로만 framework/descriptive_slug 보강
 */
function applyFrameworkFromTopics(repo: Repository): Repository {
  // null도 “이미 처리됨”으로 간주해서 반복 enrichment 방지
  if (repo.framework !== undefined || repo.descriptive_slug !== undefined) return repo;

  const framework = detectFrameworkFromTopicsOnly(repo.topics);
  const descriptive_slug = inferDescriptiveSlug(framework, repo, repo.languages ?? {});

  return { ...repo, framework, descriptive_slug };
}

// ----------------------------
// Enrichment (GraphQL + optional monorepo scan)
// ----------------------------

export async function enrichRepository(repo: Repository): Promise<Repository> {
  if (repo.framework !== undefined || repo.descriptive_slug !== undefined) return repo;

  const owner = repo.owner?.login;
  if (!owner) return repo;

  try {
    const branch = buildBranchExpr(repo);

    // 1) base signals (1 call)
    const signals = await fetchRepoSignals(owner, repo.name, branch);

    // 2) optional monorepo scan (only if needed, capped)
    let needsPubspec = !signals.pubspecText;
    let needsPackageJson = !signals.packageJsonText;

    if (needsPubspec || needsPackageJson) {
      const dirs = ['apps', 'packages', 'examples', 'modules']
        .filter((d) => signals.rootNames.has(d))
        .slice(0, 2); // hard cap

      for (const dir of dirs) {
        if (!needsPubspec && !needsPackageJson) break;

        const scan = await scanOneSubdir(owner, repo.name, branch, dir);

        // merge discovered entries into rootNames “virtual root”
        for (const name of scan.entries) {
          // keep as `${dir}/${name}` to avoid collisions and keep meaning
          signals.rootNames.add(`${dir}/${name}`);
        }

        if (!signals.pubspecText && scan.pubspecText) {
          signals.pubspecText = scan.pubspecText;
          needsPubspec = false;
        }
        if (!signals.packageJsonText && scan.packageJsonText) {
          signals.packageJsonText = scan.packageJsonText;
          needsPackageJson = false;
        }
      }
    }

    const result = await detectFrameworkRich(repo, signals);

    // topics 보강: REST + GraphQL merge
    const mergedTopics = Array.from(new Set([...(repo.topics ?? []), ...(signals.topics ?? [])]));

    return {
      ...repo,
      topics: mergedTopics,
      languages: signals.languages, // GraphQL sizes가 더 “진짜”임
      framework: result.framework, // null 가능
      descriptive_slug: result.descriptive_slug,
      framework_candidates: result.framework_candidates,
      ecosystems: result.ecosystems,
    };
  } catch (error) {
    console.error('Failed to detect framework for repository.', { repo: repo.full_name, error });
    return repo;
  }
}

// ----------------------------
// GitHub fetch exports
// ----------------------------

type FetchRepoOptions = {
  minSizeKb?: number;
  includeForks?: boolean;
  includeArchived?: boolean;
};

export async function fetchRepositories(opts: FetchRepoOptions = {}): Promise<Repository[]> {
  const octokit = getOctokit();
  const EP_REPOS: keyof Endpoints = 'GET /user/repos';

  const repositories = await octokit
    .request(EP_REPOS, {
      type: 'public',
      per_page: 100,
      direction: 'desc',
      sort: 'pushed',
      headers: DEFAULT_HEADERS,
    })
    .then((value) => value.data);

  const minSizeKb = opts.minSizeKb ?? 4000;
  const includeForks = opts.includeForks ?? false;
  const includeArchived = opts.includeArchived ?? false;

  const filtered = repositories
    .filter((R) => includeForks || !R.fork)
    .filter((R) => R.size >= minSizeKb)
    .filter((R) => includeArchived || !R.archived)
    .map((r) => pickRepository(r));

  return sortRepositoriesDefault(filtered);
}

export async function fetchRepository(owner: string, repo: string): Promise<Repository> {
  const octokit = getOctokit();
  const EP_REPO: keyof Endpoints = 'GET /repos/{owner}/{repo}';

  const raw = await octokit
    .request(EP_REPO, { owner, repo, headers: DEFAULT_HEADERS })
    .then((value) => value.data);

  const picked = pickRepository(raw);
  return await enrichRepository(picked);
}

// ----------------------------
// File system helpers (atomic writes + awaited)
// ----------------------------

async function ensureDir(dirPath: string): Promise<void> {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function writeJsonAtomic(filePath: string, data: unknown): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);

  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  const payload = JSON.stringify(data, null, 2);

  await fs.promises.writeFile(tmpPath, payload, 'utf8');
  await fs.promises.rename(tmpPath, filePath);
}

// ----------------------------
// Batch downloads
// ----------------------------

export async function fetchStarredRepository(): Promise<void> {
  const octokit = getOctokit();
  const EP_STARS: keyof Endpoints = 'GET /user/starred';

  const stars = await octokit
    .request(EP_STARS, {
      sort: 'created',
      direction: 'desc',
      per_page: 100,
      headers: DEFAULT_HEADERS,
    })
    .then((s) => s.data);

  const repositories = stars
    .filter((R) => !R.fork && R.size > 4000 && !R.archived)
    .map((r) => pickRepository(r));

  await ensureDir(starsDirectory);

  await Promise.all(
    repositories.map(async (json) => {
      const targetJsonPath = path.join(starsDirectory, `${json.name}.json`);
      await writeJsonAtomic(targetJsonPath, json);
    }),
  );
}

export async function downloadJSON(): Promise<number> {
  await ensureDir(reposDirectory);

  const repositories = await fetchRepositories({ minSizeKb: 0, includeForks: false });

  const limit = createLimiter(6);
  const repositoryData = await Promise.all(
    repositories.map((repo) => limit(() => enrichRepository(repo))),
  );

  await Promise.all(
    repositoryData.map(async (json) => {
      const targetJsonPath = path.join(reposDirectory, `${json.name}.json`);
      await writeJsonAtomic(targetJsonPath, json);
    }),
  );

  return repositoryData.length;
}

// ----------------------------
// Static JSON readers
// ----------------------------

function readReposIds(): { params: { repo: string } }[] {
  const fileNames = fs.readdirSync(reposDirectory);
  return fileNames
    .filter((n) => n.endsWith('.json'))
    .map((fileName) => {
      const repo = fileName.replace(/\.json$/, '');
      return { params: { repo } };
    });
}

export function readData(repo: string): Repository {
  const fullPath = path.join(reposDirectory, `${repo}.json`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return applyFrameworkFromTopics(JSON.parse(fileContents) as Repository);
}

export function readRepositories(): Repository[] {
  const allReposData = readReposIds().map(({ params: { repo } }) => readData(repo));
  return sortRepositoriesDefault(allReposData);
}

// Test-only exports (kept minimal to avoid leaking internals in production usage)
export const __test__ = {
  brandTitleToFrameworkKey,
};
