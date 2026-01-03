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

// ---------- Topic heuristics ----------

const FLUTTER_TOPICS = new Set(['flutter', 'flutter-plugin', 'flutter-package', 'flutter-app']);
const REACT_NATIVE_TOPICS = new Set(['react-native', 'reactnative', 'expo']);
const NEXT_TOPICS = new Set(['nextjs', 'next.js', 'next-js', 'next']);

/**
 * 프레임워크 후보 (진짜 프레임워크만)
 * - language slug들은 descriptive_slug fallback에서만 사용
 */
const FRAMEWORKS = {
  flutter: 'Flutter',
  nextdotjs: 'Next.js',
  reactnative: 'React Native',
} as const satisfies Record<string, string>;

type FrameworkKey = keyof typeof FRAMEWORKS;

// BrandSlug/BrandTitle이 리터럴 유니온이든 string이든 안전하게 취급
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

// ---------- Language slug fallback ----------

/**
 * GitHub language name -> BrandSlug 추정
 * (실제 BrandSlug(=simple-icons slug 등)과 다를 수 있으니, 프로젝트에서 쓰는 slug 규칙에 맞게 조정 가능)
 */
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
  // 1) REST repo.language 우선
  const primary = (repo.language ?? '').trim();
  if (primary) return primary;

  // 2) GraphQL languages sizes 최댓값
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
  // framework가 있으면 그 slug
  if (decidedFramework) {
    const slug = SLUG_BY_BRAND[decidedFramework];
    return slug ?? null;
  }

  // 없으면 language slug
  const langName = pickPrimaryLanguageName(repo, languageMap);
  if (!langName) return null;

  return LANGUAGE_TO_SLUG[langName] ?? null;
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

  // Julia
  if (root.has('Manifest.toml') || root.has('Project.toml')) out.add('Julia');

  // Swift Package Manager
  if (root.has('Package.resolved') || root.has('Package.swift')) out.add('Swift Package Manager');

  // NuGet (루트에 있을 때만)
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

  // Ecosystems (SBOM 대체) — Flutter만 보조로 약하게
  const ecosystems = inferEcosystemsFromFiles(signals.rootNames, signals.workflowNames);
  if (ecosystems.includes('pub')) addScore(scoreMap, 'flutter', 15, 'ecosystem: pub present');

  // ✅ 요구사항 반영: JS/TS 존재만으로 Next/RN 점수 추가는 제거
  // (언어 힌트는 descriptive_slug fallback 용도로만 사용)

  const framework_candidates: Candidate[] = Array.from(scoreMap.entries())
    .map(([key, v]) => {
      const slug = key as unknown as BrandSlug;
      const name = BRAND_BY_KEY[slug];
      return { slug, name, score: v.score, reasons: v.reasons };
    })
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

  for (const t of FLUTTER_TOPICS) if (normalized.has(t)) return 'Flutter' as BrandTitle;
  for (const t of REACT_NATIVE_TOPICS) if (normalized.has(t)) return 'React Native' as BrandTitle;
  for (const t of NEXT_TOPICS) if (normalized.has(t)) return 'Next.js' as BrandTitle;

  return null;
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
 * @description (오프라인) topics 기반으로만 framework/descriptive_slug 보강
 */
function applyFrameworkFromTopics(repo: Repository): Repository {
  // 이미 값이 있으면 건드리지 않음 (framework가 null인 경우도 “이미 처리됨”으로 간주)
  if (repo.framework !== undefined || repo.descriptive_slug !== undefined) return repo;

  const framework = detectFrameworkFromTopicsOnly(repo.topics);
  const descriptive_slug = inferDescriptiveSlug(framework, repo, repo.languages ?? {});

  return {
    ...repo,
    framework, // null 가능
    descriptive_slug, // null 가능
  } as Repository;
}

async function enrichRepository(repo: Repository): Promise<Repository> {
  // framework가 null이어도 “이미 enriched”로 취급해서 추가 API 호출 방지
  if (repo.framework !== undefined || repo.descriptive_slug !== undefined) return repo;

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

    return {
      ...copy,
      framework: result.framework, // ✅ null 저장
      descriptive_slug: result.descriptive_slug, // ✅ framework 또는 language slug
      framework_candidates: result.framework_candidates,
      ecosystems: result.ecosystems,
      // GraphQL에서 뽑은 languages 저장
      languages: signals.languages,
      // topics도 GraphQL 쪽이 더 완전할 수 있어 합쳐 저장(원치 않으면 제거)
      topics: Array.from(new Set([...(repo.topics ?? []), ...(signals.topics ?? [])])),
    } as Repository;
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

export async function downloadJSON(): Promise<number> {
  const repositories = await fetchRepositories();

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
