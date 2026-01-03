import fs from 'node:fs';

import { Octokit } from '@octokit/core';
import { type Endpoints } from '@octokit/types';
import path from 'path';

import type Repository from '@/interface/repos';
import { BrandSlug, BrandTitle, Ecosystem } from '@/interface/stack';
import { sortRepositoriesDefault } from '@/lib/repo-sort';

const { GITHUB_TOKEN } = process.env;

if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is required.');
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

const reposDirectory = path.join(process.cwd(), 'data/repos');
const starsDirectory = path.join(process.cwd(), 'data/stars');

type Candidate = {
  slug: BrandSlug;
  name: BrandTitle;
  score: number;
  reasons: string[];
};

type DetectResult = {
  framework?: BrandTitle;
  framework_slug?: BrandSlug;
  framework_candidates: Candidate[];
  ecosystems: Ecosystem[];
};

type DetectOptions = {
  minScoreToDecide: number;
};

const DEFAULT_DETECT_OPTIONS: DetectOptions = {
  minScoreToDecide: 80,
};

// ---------- Topic heuristics ----------

const FLUTTER_TOPICS = new Set(['flutter', 'flutter-plugin', 'flutter-package', 'flutter-app']);
const REACT_NATIVE_TOPICS = new Set(['react-native', 'reactnative', 'expo']);
const NEXT_TOPICS = new Set(['nextjs', 'next.js', 'next-js', 'next']);

// (프레임워크 후보를 “진짜 프레임워크”로만 제한)
// stack.ts의 FrameworkSlug/Brand가 리터럴 유니온이라면, 여기 키/값이 그 범위 안에 있어야 합니다.
const FRAMEWORKS = {
  flutter: 'Flutter',
  nextdotjs: 'Next.js',
  reactnative: 'React Native',
} as const satisfies Record<string, string>;

type FrameworkKey = keyof typeof FRAMEWORKS;

// 안전하게 FrameworkSlug/Brand로 캐스팅(원본 타입이 string이면 그대로 OK, 리터럴이면 유효한 값만 들어옴)
const BRAND_BY_KEY = FRAMEWORKS as unknown as Record<BrandSlug, BrandTitle>;
const SLUG_BY_BRAND: Record<BrandTitle, BrandSlug> = Object.fromEntries(
  Object.entries(FRAMEWORKS).map(([k, v]) => [v, k]),
) as unknown as Record<BrandTitle, BrandSlug>;

// ---------- Small concurrency limiter (no deps) ----------

function createLimiter(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const next = () => {
    if (active >= concurrency) return;
    const job = queue.shift();
    if (!job) return;
    active++;
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
          active--;
          next();
        }
      });
      next();
    });
  };
}

// ---------- Detection utilities ----------

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

    // React Native
    if (deps['react-native'] || deps.expo || keys.some((k) => k.startsWith('@react-native/'))) {
      hits.push('reactnative');
    }

    // Next.js
    if (deps.next) {
      hits.push('nextdotjs');
    }

    return hits;
  } catch {
    return [];
  }
}

// ---------- GraphQL signals (1 call / repo) ----------

const DEFAULT_HEADERS = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

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
  rootNames: Set<string>;
  workflowNames: Set<string>;
  pubspecText?: string;
  packageJsonText?: string;
};

async function graphqlRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await octokit.request('POST /graphql', {
    query,
    variables,
    headers: DEFAULT_HEADERS,
  });

  // Octokit 환경별로 res.data 형태가 다를 수 있어 방어
  const data = res.data as unknown as { data?: T } | T;
  return (typeof data === 'object' && data !== null && 'data' in data ? data.data : data) as T;
}

const REPO_SIGNALS_QUERY = /* GraphQL */ `
  query RepoSignals($owner: String!, $name: String!) {
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

      pubspec: object(expression: "HEAD:pubspec.yaml") {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }

      packageJson: object(expression: "HEAD:package.json") {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }

      root: object(expression: "HEAD:") {
        __typename
        ... on Tree {
          entries {
            name
            type
          }
        }
      }

      workflows: object(expression: "HEAD:.github/workflows") {
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
  entries: Array<{ name?: string | null; type?: string | null } | null> | null | undefined,
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

async function fetchRepoSignals(owner: string, repo: string): Promise<RepoSignals> {
  const data = await graphqlRequest<GraphQLRepoSignals>(REPO_SIGNALS_QUERY, { owner, name: repo });

  if (!data.repository) {
    return {
      topics: [],
      languages: {},
      rootNames: new Set(),
      workflowNames: new Set(),
    };
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

// ---------- Ecosystem inference (SBOM 대체) ----------

function inferEcosystemsFromFiles(root: Set<string>, workflows: Set<string>): Ecosystem[] {
  const out = new Set<Ecosystem>();

  const hasAnySuffix = (suffixes: string[]) =>
    Array.from(root).some((name) => suffixes.some((s) => name.endsWith(s)));

  // GitHub Actions
  if (Array.from(workflows).some((n) => n.endsWith('.yml') || n.endsWith('.yaml'))) {
    out.add('GitHub Actions workflows');
  }

  // Node ecosystems
  if (root.has('pnpm-lock.yaml')) out.add('pnpm');
  if (root.has('yarn.lock')) out.add('Yarn');
  if (root.has('package-lock.json')) out.add('npm');
  // package.json만으로 npm이라 단정하긴 애매하지만 ecosystem 목록으로는 넣어도 괜찮으면 주석 해제
  // if (root.has('package.json')) out.add('npm');

  // Dart/Flutter
  if (root.has('pubspec.yaml') || root.has('pubspec.lock')) out.add('pub');

  // Python
  if (root.has('requirements.txt') || root.has('Pipfile') || root.has('Pipfile.lock'))
    out.add('pip');
  if (root.has('poetry.lock') || root.has('pyproject.toml')) out.add('Poetry');

  // Rust
  if (root.has('Cargo.lock') || root.has('Cargo.toml')) out.add('Cargo');

  // PHP
  if (root.has('composer.lock') || root.has('composer.json')) out.add('Composer');

  // Ruby
  if (root.has('Gemfile.lock') || root.has('Gemfile') || hasAnySuffix(['.gemspec']))
    out.add('RubyGems');

  // Go
  if (root.has('go.mod')) out.add('Go modules');

  // Java
  if (root.has('pom.xml')) out.add('Maven');
  if (
    root.has('build.gradle') ||
    root.has('build.gradle.kts') ||
    root.has('settings.gradle') ||
    root.has('settings.gradle.kts')
  ) {
    out.add('Gradle');
  }

  // Bazel
  if (root.has('WORKSPACE') || root.has('WORKSPACE.bazel') || root.has('MODULE.bazel'))
    out.add('Bazel');

  // Terraform/OpenTofu
  if (root.has('.terraform.lock.hcl')) out.add('OpenTofu');
  // .tf / .tofu는 “파일 확장”이라 root tree만으로는 보통 못 잡을 수 있음.
  // 필요하면 root entries를 suffix 스캔하거나(레포 루트에 있는 경우), 2-depth tree까지 가는 방식 추가.

  // Julia
  if (root.has('Manifest.toml') || root.has('Project.toml')) out.add('Julia');

  // Swift Package Manager
  if (root.has('Package.resolved') || root.has('Package.swift')) out.add('Swift Package Manager');

  // NuGet (.csproj etc) - 루트에 있는 경우만 포착
  if (
    hasAnySuffix(['.csproj', '.fsproj', '.vbproj', '.vcxproj', '.nuspec']) ||
    root.has('packages.config')
  ) {
    out.add('NuGet');
  }

  return Array.from(out);
}

// ---------- Framework detection (scored, explainable) ----------

async function detectFrameworkRich(
  repo: Repository,
  signals: RepoSignals,
  options: DetectOptions = DEFAULT_DETECT_OPTIONS,
): Promise<DetectResult> {
  const scoreMap = new Map<FrameworkKey, { score: number; reasons: string[] }>();

  // Topics: REST topics + GraphQL topics (보강)
  const mergedTopics = normalizeTopics([...(repo.topics ?? []), ...(signals.topics ?? [])]);

  if ([...FLUTTER_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'flutter', 100, 'topic match');
  if ([...REACT_NATIVE_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'reactnative', 100, 'topic match');
  if ([...NEXT_TOPICS].some((t) => mergedTopics.has(t)))
    addScore(scoreMap, 'nextdotjs', 100, 'topic match');

  // File signals
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

  // Ecosystems (SBOM 대체) — 프레임워크 결정 “보조” 정도로만 사용
  const ecosystems = inferEcosystemsFromFiles(signals.rootNames, signals.workflowNames);
  if (ecosystems.includes('pub')) addScore(scoreMap, 'flutter', 15, 'ecosystem: pub present');

  // Language hints (결정에는 쓰지 않음, tie-break 정도)
  const languageMap = signals.languages ?? {};
  const primaryLanguage = repo.language?.toLowerCase();

  const hasDart = primaryLanguage === 'dart' || (languageMap.Dart ?? 0) > 0;
  const hasJS = primaryLanguage === 'javascript' || (languageMap.JavaScript ?? 0) > 0;
  const hasTS = primaryLanguage === 'typescript' || (languageMap.TypeScript ?? 0) > 0;

  if (hasDart) addScore(scoreMap, 'flutter', 5, 'language hint: Dart present');
  if (hasJS || hasTS) {
    addScore(scoreMap, 'nextdotjs', 2, 'language hint: JS/TS present');
    addScore(scoreMap, 'reactnative', 2, 'language hint: JS/TS present');
  }

  const framework_candidates: Candidate[] = Array.from(scoreMap.entries())
    .map(([key, v]) => {
      const slug = key as unknown as BrandSlug;
      const name = BRAND_BY_KEY[slug];
      return {
        slug,
        name,
        score: v.score,
        reasons: v.reasons,
      };
    })
    .sort((a, b) => b.score - a.score);

  const top = framework_candidates[0];
  const framework = top && top.score >= options.minScoreToDecide ? top.name : undefined;
  const framework_slug = framework ? SLUG_BY_BRAND[framework] : undefined;

  return { framework, framework_slug, framework_candidates, ecosystems };
}

function detectFrameworkFromTopicsOnly(topics?: string[]): BrandTitle | undefined {
  if (!topics?.length) return undefined;
  const normalized = normalizeTopics(topics);

  for (const t of FLUTTER_TOPICS) if (normalized.has(t)) return 'Flutter' as BrandTitle;
  for (const t of REACT_NATIVE_TOPICS) if (normalized.has(t)) return 'React Native' as BrandTitle;
  for (const t of NEXT_TOPICS) if (normalized.has(t)) return 'Next.js' as BrandTitle;

  return undefined;
}

// ---------- Repo shaping / filtering ----------

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function reclusiveFilter(repo: { [x: string]: any }): Repository {
  Object.entries(repo).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      delete repo[key];
      return;
    }

    if (Array.isArray(value)) {
      repo[key] = value;
      return;
    }

    switch (typeof value) {
      case 'string': {
        if (value.endsWith('.git')) delete repo[key];
        else if (value.includes('{')) delete repo[key];
        else repo[key] = value;
        break;
      }
      case 'object': {
        if (key === 'topics') {
          repo[key] = value;
          return;
        }
        repo[key] = reclusiveFilter(value);
        break;
      }
      default: {
        repo[key] = value;
        break;
      }
    }
  });

  return repo as Repository;
}

/**
 * @description topics 기반으로만 framework를 보강 (파일/네트워크 없이)
 */
function applyFrameworkFromTopics(repo: Repository): Repository {
  if (repo.framework) return repo;

  const framework = detectFrameworkFromTopicsOnly(repo.topics);
  if (!framework) return repo;

  return { ...repo, framework } as Repository;
}

async function enrichRepository(repo: Repository): Promise<Repository> {
  if (repo.framework) return repo;

  const owner = repo.owner?.login;
  if (!owner) return repo;

  try {
    const signals = await fetchRepoSignals(owner, repo.name);
    const result = await detectFrameworkRich(repo, signals);

    // sanitize api.github urls if present (shallow; keep behavior)
    const copy = Object(repo);
    Object.entries(copy).forEach(([key, value]) => {
      if (typeof value === 'string' && value.includes('api.github')) delete copy[key];
      if (typeof value === 'object' && value) {
        const inner = Object(value);
        Object.entries(inner).forEach(([k, v]) => {
          if (typeof v === 'string' && v.includes('api.github')) delete inner[k];
        });
        copy[key] = inner;
      }
    });

    const enriched = {
      ...copy,
      framework: result.framework,
      framework_slug: result.framework_slug,
      framework_candidates: result.framework_candidates,
      ecosystems: result.ecosystems,
      // GraphQL에서 뽑은 languages는 저장해두면 이후 작업에 유용함
      languages: signals.languages,
    };

    return (result.framework ? enriched : { ...enriched, framework: undefined }) as Repository;
  } catch (error) {
    console.error('Failed to detect framework for repository.', {
      repo: repo.full_name,
      error,
    });
    return repo;
  }
}

// ---------- GitHub fetch exports ----------

export async function fetchRepositories(): Promise<Repository[]> {
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

  const filtered = repositories
    .filter((R) => !R.fork && R.size > 4000 && !R.archived)
    .map((repo) => reclusiveFilter(repo));

  return sortRepositoriesDefault(filtered);
}

export async function fetchStarredRepository(): Promise<void> {
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
    .map((repo) => reclusiveFilter(repo));

  repositories.forEach((json) => {
    const targetJsonPath = path.join(starsDirectory, `${json.name}.json`);
    fs.writeFile(targetJsonPath, JSON.stringify(json, null, 2), { flag: 'w' }, (err) => {
      if (err) console.error(err);
    });
  });
}

export async function fetchRepository(owner: string, repo: string): Promise<Repository> {
  const EP_REPO: keyof Endpoints = 'GET /repos/{owner}/{repo}';

  const filtered = await octokit
    .request(EP_REPO, { owner, repo, headers: DEFAULT_HEADERS })
    .then((value) => value.data)
    .then((r) => reclusiveFilter(r));

  return await enrichRepository(filtered);
}

/**
 * @description 리포지토리를 가져오고 프레임워크/에코시스템을 추론해 정적 폴더에 JSON으로 저장.
 */
export async function downloadJSON(): Promise<number> {
  const repositories = await fetchRepositories();

  // 동시성 제한 (secondary rate limit 회피)
  const limit = createLimiter(6);

  const repositoryData = await Promise.all(
    repositories.map((repo) => limit(() => enrichRepository(repo))),
  );

  repositoryData.forEach((json) => {
    const targetJsonPath = path.join(reposDirectory, `${json.name}.json`);
    fs.writeFile(targetJsonPath, JSON.stringify(json, null, 2), { flag: 'w' }, (err) => {
      if (err) console.error(err);
    });
  });

  return repositoryData.length;
}

// ---------- Static JSON readers ----------

function readReposIds(): { params: { repo: string } }[] {
  const fileNames = fs.readdirSync(reposDirectory);
  return fileNames.map((fileName) => {
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
