import fs from 'node:fs';

import { Octokit } from '@octokit/core';
import { type Endpoints } from '@octokit/types';
import path from 'path';

import type Repository from '@/interface/repos';
import { Ecosystem, FrameworkBrand, FrameworkSlug } from '@/interface/stack';
import { sortRepositoriesDefault } from '@/lib/repo-sort';

const { GITHUB_TOKEN } = process.env;

if (!GITHUB_TOKEN) {
  // Fail fast in CI / local if token missing (rate limits will bite hard).
  // If you truly want anonymous mode, remove this guard.
  throw new Error('GITHUB_TOKEN is required.');
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

const reposDirectory = path.join(process.cwd(), 'data/repos');
const starsDirectory = path.join(process.cwd(), 'data/stars');

type SBOM = {
  SPDXID: string;
  spdxVersion: string;
  comment?: string;
  creationInfo: {
    created: string;
    creators: string[];
  };
  name: string;
  dataLicense: string;
  documentNamespace: string;
  packages: {
    SPDXID?: string;
    name?: string;
    versionInfo?: string;
    downloadLocation?: string;
    filesAnalyzed?: boolean;
    licenseConcluded?: string;
    licenseDeclared?: string;
    supplier?: string;
    copyrightText?: string;
    externalRefs?: {
      referenceCategory: string;
      referenceLocator: string;
      referenceType: string;
    }[];
  }[];
  relationships?: {
    relationshipType?: string;
    spdxElementId?: string;
    relatedSpdxElement?: string;
  }[];
};

type Candidate = {
  slug: FrameworkSlug;
  name: FrameworkBrand;
  score: number;
  reasons: string[];
};

type DetectResult = {
  framework?: FrameworkBrand;
  framework_slug?: FrameworkSlug;
  framework_candidates: Candidate[];
  ecosystems: Ecosystem[];
};

// ---------- Topic heuristics ----------

const FLUTTER_TOPICS = new Set(['flutter', 'flutter-plugin', 'flutter-package', 'flutter-app']);
const REACT_NATIVE_TOPICS = new Set(['react-native', 'reactnative', 'expo']);
const NEXT_TOPICS = new Set(['nextjs', 'next.js', 'next-js', 'next']);
const BRAND_BY_SLUG: Record<FrameworkSlug, FrameworkBrand> = {
  flutter: 'Flutter',
  nextdotjs: 'Next.js',
  reactnative: 'React Native',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  dart: 'Dart',
};
const SLUG_BY_BRAND: Record<FrameworkBrand, FrameworkSlug> = {
  'Flutter': 'flutter',
  'Next.js': 'nextdotjs',
  'React Native': 'reactnative',
  'TypeScript': 'typescript',
  'JavaScript': 'javascript',
  'Dart': 'dart',
};

// ---------- Detection utilities ----------

function normalizeTopics(topics?: string[]): Set<string> {
  return new Set((topics ?? []).map((t) => t.toLowerCase().trim()).filter(Boolean));
}

function addScore(
  map: Map<FrameworkSlug, { score: number; reasons: string[] }>,
  slug: FrameworkSlug,
  delta: number,
  reason: string,
) {
  const cur = map.get(slug) ?? { score: 0, reasons: [] };
  cur.score += delta;
  cur.reasons.push(`${delta >= 0 ? '+' : ''}${delta} ${reason}`);
  map.set(slug, cur);
}

function isFlutterPubspec(content: string): boolean {
  // Strong signals:
  // - top-level "flutter:" section
  // - "sdk: flutter"
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

function detectFromPackageJson(content: string): FrameworkSlug[] {
  try {
    const deps = parsePackageJsonDeps(content);
    const keys = Object.keys(deps);

    const hits: FrameworkSlug[] = [];

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

// ---------- GitHub fetch helpers ----------

const DEFAULT_HEADERS = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

async function fetchRepoFile(
  owner: string,
  repo: string,
  filePath: string,
): Promise<string | null> {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: filePath,
      headers: DEFAULT_HEADERS,
    });

    const data = response.data as { content?: string; encoding?: string } | unknown[];

    // Directory listing (array) → not a file
    if (Array.isArray(data) || typeof data !== 'object' || data === null) {
      return null;
    }

    if (typeof data.content !== 'string') {
      return null;
    }

    const encoding = typeof data.encoding === 'string' ? data.encoding : 'base64';

    // GitHub returns base64 with line breaks sometimes.
    const cleaned = data.content.replace(/\n/g, '');
    return Buffer.from(cleaned, encoding as BufferEncoding).toString('utf8');
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const status = (error as { status?: number }).status;
      if (status === 404) return null;
      // 403 can happen on rate limiting / permissions; we treat as “no data”
      if (status === 403) return null;
    }
    throw error;
  }
}

async function fetchSbom(owner: string, repo: string): Promise<SBOM | null> {
  try {
    const res = await octokit.request('GET /repos/{owner}/{repo}/dependency-graph/sbom', {
      owner,
      repo,
      headers: DEFAULT_HEADERS,
    });
    return res.data.sbom; // SPDX JSON-ish
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const status = (error as { status?: number }).status;
      // 404: dependency graph not available (or disabled)
      // 403: insufficient permissions or feature disabled
      if (status === 404 || status === 403) return null;
    }
    throw error;
  }
}

function parseEcosystemsFromSbom(sbom: SBOM): Set<Ecosystem> {
  const out = new Set<Ecosystem>();
  const packages = Array.isArray(sbom?.packages)
    ? sbom.packages
    : Array.isArray(sbom?.packages)
      ? sbom.packages
      : [];

  for (const pkg of packages) {
    const refs = Array.isArray(pkg?.externalRefs) ? pkg.externalRefs : [];
    const purlRef = refs.find(
      (r) => r?.referenceType === 'purl' && typeof r?.referenceLocator === 'string',
    );
    const purl = (purlRef?.referenceLocator as string | undefined) ?? '';
    if (!purl) continue;

    if (purl.startsWith('pkg:npm/')) out.add('npm');
    else if (purl.startsWith('pkg:pub/')) out.add('pub');
    else if (purl.startsWith('pkg:githubactions/')) out.add('GitHub Actions workflows');
  }

  return out;
}

function sbomHasNpmPackage(sbom: SBOM, name: string): boolean {
  const packages = Array.isArray(sbom?.packages)
    ? sbom.packages
    : Array.isArray(sbom?.packages)
      ? sbom.packages
      : [];

  for (const pkg of packages) {
    const refs = Array.isArray(pkg?.externalRefs) ? pkg.externalRefs : [];
    const purlRef = refs.find(
      (r) => r?.referenceType === 'purl' && typeof r?.referenceLocator === 'string',
    );
    const purl = (purlRef?.referenceLocator as string | undefined) ?? '';
    // purl: pkg:npm/next@14.0.0
    if (purl === `pkg:npm/${name}` || purl.startsWith(`pkg:npm/${name}@`)) return true;
  }

  return false;
}

// ---------- Framework detection (scored, explainable) ----------

type DetectOptions = {
  includeSbomEcosystems: boolean;
  includeSbomSignals: boolean;
  minScoreToDecide: number;
};

const DEFAULT_DETECT_OPTIONS: DetectOptions = {
  includeSbomEcosystems: true,
  includeSbomSignals: true,
  minScoreToDecide: 80,
};

async function detectFrameworkRich(
  repo: Repository,
  languages?: Record<string, number>,
  options: DetectOptions = DEFAULT_DETECT_OPTIONS,
): Promise<DetectResult> {
  const owner = repo.owner?.login;
  if (!owner) {
    return { framework_candidates: [], ecosystems: [] };
  }

  const scoreMap = new Map<FrameworkSlug, { score: number; reasons: string[] }>();

  // 1) Topics (strongest when present)
  const topics = normalizeTopics(repo.topics);

  if ([...FLUTTER_TOPICS].some((t) => topics.has(t)))
    addScore(scoreMap, 'flutter', 100, 'topic match');
  if ([...REACT_NATIVE_TOPICS].some((t) => topics.has(t)))
    addScore(scoreMap, 'reactnative', 100, 'topic match');
  if ([...NEXT_TOPICS].some((t) => topics.has(t)))
    addScore(scoreMap, 'nextdotjs', 100, 'topic match');

  // 2) File signals (cheap, strong)
  // Flutter
  const pubspec = await fetchRepoFile(owner, repo.name, 'pubspec.yaml');
  if (pubspec && isFlutterPubspec(pubspec)) {
    addScore(scoreMap, 'flutter', 90, 'pubspec.yaml indicates Flutter');
  }

  // JS/TS frameworks
  const packageJson = await fetchRepoFile(owner, repo.name, 'package.json');
  if (packageJson) {
    const hits = detectFromPackageJson(packageJson);
    if (hits.includes('reactnative'))
      addScore(scoreMap, 'reactnative', 90, 'package.json deps indicate RN');
    if (hits.includes('nextdotjs'))
      addScore(scoreMap, 'nextdotjs', 90, 'package.json deps indicate Next.js');
  }

  // 3) Language hints (weak, only to help in ambiguous repos)
  // NOTE: Do not use language to “decide” by itself.
  const primaryLanguage = repo.language?.toLowerCase();
  const languageMap = languages ?? (repo.languages as Record<string, number> | undefined) ?? {};
  const hasDart =
    primaryLanguage === 'dart' || (typeof languageMap.Dart === 'number' && languageMap.Dart > 0);
  const hasJS = primaryLanguage === 'javascript' || typeof languageMap.JavaScript === 'number';
  const hasTS = primaryLanguage === 'typescript' || typeof languageMap.TypeScript === 'number';

  if (hasDart) addScore(scoreMap, 'dart', 5, 'language hint: Dart present');
  if (hasJS) addScore(scoreMap, 'javascript', 1, 'language hint: JavaScript present');
  if (hasTS) addScore(scoreMap, 'typescript', 1, 'language hint: TypeScript present');

  // 4) SBOM (ecosystems + reinforcement)
  let ecosystems: Ecosystem[] = [];
  if (options.includeSbomEcosystems || options.includeSbomSignals) {
    const sbom = await fetchSbom(owner, repo.name);
    if (sbom) {
      ecosystems = Array.from(parseEcosystemsFromSbom(sbom));

      if (options.includeSbomSignals) {
        if (sbomHasNpmPackage(sbom, 'next'))
          addScore(scoreMap, 'nextdotjs', 60, 'SBOM has npm:next');
        if (sbomHasNpmPackage(sbom, 'react-native') || sbomHasNpmPackage(sbom, 'expo')) {
          addScore(scoreMap, 'reactnative', 60, 'SBOM has npm:react-native/expo');
        }

        // Flutter: SBOM might only show pub packages; keep it weak (real Flutter signal is pubspec)
        if (ecosystems.includes('pub'))
          addScore(scoreMap, 'dart', 10, 'SBOM includes pub ecosystem');
      }
    }
  }

  const framework_candidates: Candidate[] = Array.from(scoreMap.entries())
    .map(([slug, v]) => ({
      slug,
      name: BRAND_BY_SLUG[slug],
      score: v.score,
      reasons: v.reasons,
    }))
    .sort((a, b) => b.score - a.score);

  const top = framework_candidates[0];
  const framework = top && top.score >= options.minScoreToDecide ? top.name : undefined;
  const framework_slug = framework ? SLUG_BY_BRAND[framework] : undefined;

  return { framework, framework_slug, framework_candidates, ecosystems };
}

function detectFrameworkFromTopicsOnly(topics?: string[]): FrameworkBrand | undefined {
  if (!topics?.length) return undefined;

  const normalized = normalizeTopics(topics);

  for (const t of FLUTTER_TOPICS) if (normalized.has(t)) return 'Flutter';
  for (const t of REACT_NATIVE_TOPICS) if (normalized.has(t)) return 'React Native';
  for (const t of NEXT_TOPICS) if (normalized.has(t)) return 'Next.js';

  return undefined;
}

// ---------- Repo shaping / filtering ----------

/**
 * @description 리포지토리 데이터에서 특정 속성을 재귀적으로 필터링.
 * @param repo - 키가 문자열이고 값이 모든 유형일 수 있는 키-값 쌍이 포함.
 * @returns 필터링된 리포지토리 객체.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function reclusiveFilter(repo: { [x: string]: any }): Repository {
  Object.entries(repo).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      delete repo[key];
      return;
    }

    // Preserve arrays as-is (your previous version accidentally recursed into arrays)
    if (Array.isArray(value)) {
      repo[key] = value;
      return;
    }

    switch (typeof value) {
      case 'string': {
        // remove noisy/unstable fields
        if (value.endsWith('.git')) delete repo[key];
        else if (value.includes('{')) delete repo[key];
        else repo[key] = value;
        break;
      }
      case 'object': {
        // Keep topics as-is (already array, handled above, but safe)
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
 * - 정적 JSON을 읽을 때 쓰기 좋음
 */
function applyFrameworkFromTopics(repo: Repository): Repository {
  // If already set, do nothing.
  if (repo.framework) return repo;

  const framework = detectFrameworkFromTopicsOnly(repo.topics);
  if (!framework) return repo;

  return { ...repo, framework } as Repository;
}

async function enrichRepository(
  repo: Repository,
  languages?: Record<string, number>,
): Promise<Repository> {
  // If already enriched, skip
  if (repo.framework) return repo;

  try {
    const result = await detectFrameworkRich(repo, languages);

    // Store explainable metadata too (even if framework is undefined).
    const copy = Object(repo);
    Object.entries(copy).forEach(([key, value]) => {
      if (typeof value === 'string' && value.includes('api.github')) {
        delete copy[key];
      }
      if (typeof value === 'object') {
        const inner = Object(value);
        Object.entries(inner).forEach(([k, v]) => {
          if (typeof v === 'string' && v.includes('api.github')) {
            delete inner[k];
          }
          return;
        });
        copy[key] = inner;
      }
      return;
    });
    const enriched = {
      ...copy,
      framework: result.framework,
      framework_slug: result.framework_slug,
      framework_candidates: result.framework_candidates,
      ecosystems: result.ecosystems,
    };

    // Keep output type compatible with your existing Repository interface
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

/**
 * @description 깃허브 API 통해 사용자 계정에서 리포지토리를 가져와 특정 기준에 따라 필터링하고 필터링된 리포지토리를 반환.
 */
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

  // NOTE: Don't enrich here; downloadJSON already enriches with languages.
  // Doing it twice just burns API calls.
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

/**
 * @description 깃허브 유저 및 repo 매개변수를 사용하여 리포지토리를 가져오고 가져온 데이터에 필터를 적용.
 */
export async function fetchRepository(owner: string, repo: string): Promise<Repository> {
  const EP_REPO: keyof Endpoints = 'GET /repos/{owner}/{repo}';

  const filtered = await octokit
    .request(EP_REPO, { owner, repo, headers: DEFAULT_HEADERS })
    .then((value) => value.data)
    .then((r) => reclusiveFilter(r));

  // languages_url fetch (optional but helps)
  const languages = filtered.languages_url
    ? await octokit
        .request({ url: filtered.languages_url, headers: DEFAULT_HEADERS })
        .then((res) => res.data)
    : undefined;

  return await enrichRepository({ ...filtered, languages }, languages);
}

/**
 * @description 리포지토리를 가져오고 해당 언어를 검색하며 리포지토리 데이터를 정적 폴더에 JSON 파일로 저장.
 * @returns 저장한 repositoryData 배열의 길이.
 */
export async function downloadJSON(): Promise<number> {
  const repositories = await fetchRepositories();

  const repositoryData = await Promise.all(
    repositories.map(async (repo) => {
      const languages = repo.languages_url
        ? await octokit
            .request({ url: repo.languages_url, headers: DEFAULT_HEADERS })
            .then((res) => res.data)
        : undefined;

      // enrich once, with languages
      return await enrichRepository({ ...repo, languages }, languages);
    }),
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

/**
 * @description JSON 파일을 읽고 그 내용을 Repository 객체로 반환.
 */
export function readData(repo: string): Repository {
  const fullPath = path.join(reposDirectory, `${repo}.json`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return applyFrameworkFromTopics(JSON.parse(fileContents) as Repository);
}

/**
 * @description 정적 폴더에 저장된 리포지토리 데이터를 읽고 날짜별로 정렬한 다음 정렬된 데이터를 반환.
 */
export function readRepositories(): Repository[] {
  const allReposData = readReposIds().map(({ params: { repo } }) => readData(repo));
  return sortRepositoriesDefault(allReposData);
}
