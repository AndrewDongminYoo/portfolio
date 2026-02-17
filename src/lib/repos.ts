import path from 'node:path';

import { type Endpoints } from '@octokit/types';

import type Repository from '@/interface/repos';
import { getOctokit } from '@/lib/github/client';
import { pickRepository } from '@/lib/github/pick';
import { buildBranchExpr, fetchRepoSignals, scanOneSubdir } from '@/lib/github/signals';
import { sortRepositoriesDefault } from '@/lib/repo-sort';
import { detectFrameworkRich } from '@/lib/repos/detect';
import { ensureDir, reposDirectory, starsDirectory, writeJsonAtomic } from '@/lib/repos/fs-store';
import { createLimiter } from '@/lib/repos/limiter';

// ----------------------------
// Enrichment orchestrator
// ----------------------------
export async function enrichRepository(repo: Repository): Promise<Repository> {
  if (repo.framework !== undefined || repo.descriptive_slug !== undefined) return repo;

  const owner = repo.owner?.login;
  if (!owner) return repo;

  try {
    const branch = buildBranchExpr(repo);

    const signals = await fetchRepoSignals(owner, repo.name, branch);

    let needsPubspec = !signals.pubspecText;
    let needsPackageJson = !signals.packageJsonText;

    if (needsPubspec || needsPackageJson) {
      const dirs = ['apps', 'packages', 'examples', 'modules']
        .filter((d) => signals.rootNames.has(d))
        .slice(0, 2);

      for (const dir of dirs) {
        if (!needsPubspec && !needsPackageJson) break;

        const scan = await scanOneSubdir(owner, repo.name, branch, dir);

        for (const name of scan.entries) signals.rootNames.add(`${dir}/${name}`);

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
    const mergedTopics = Array.from(new Set([...(repo.topics ?? []), ...(signals.topics ?? [])]));

    return {
      ...repo,
      topics: mergedTopics,
      languages: signals.languages,
      framework: result.framework,
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
// Public GitHub fetch exports (same API)
// ----------------------------

type FetchRepoOptions = {
  minSizeKb?: number;
  includeForks?: boolean;
  includePrivate?: boolean;
  includeArchived?: boolean;
};

export async function fetchRepositories(opts: FetchRepoOptions = {}): Promise<Repository[]> {
  const octokit = getOctokit();
  const EP_REPOS: keyof Endpoints = 'GET /user/repos';

  const repositories = await octokit
    .request(EP_REPOS, {
      type: opts.includePrivate ? 'all' : 'public',
      per_page: 100,
      direction: 'desc',
      sort: 'pushed',
      headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
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
    .request(EP_REPO, {
      owner,
      repo,
      headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    })
    .then((value) => value.data);

  return await enrichRepository(pickRepository(raw));
}

export async function fetchStarredRepository(): Promise<void> {
  const octokit = getOctokit();
  const EP_STARS: keyof Endpoints = 'GET /user/starred';

  const stars = await octokit
    .request(EP_STARS, {
      sort: 'created',
      direction: 'desc',
      per_page: 100,
      headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    })
    .then((s) => s.data);

  const repositories = stars
    .filter((R) => !R.fork && R.size > 4000 && !R.archived)
    .map((r) => pickRepository(r));

  ensureDir(starsDirectory);

  await Promise.all(
    repositories.map(async (json) => {
      const targetJsonPath = path.join(starsDirectory, `${json.name}.json`);
      await writeJsonAtomic(targetJsonPath, json);
    }),
  );
}

export async function downloadJSON(): Promise<number> {
  ensureDir(reposDirectory);

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
