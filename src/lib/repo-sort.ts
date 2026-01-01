import { parseISO } from 'date-fns/parseISO';

import type Repository from '@/interface/repos';

export const SCORE_WEIGHTS = {
  stars: 3,
  forks: 2,
  watchers: 1,
} as const;

export const PINNED_SCORE_THRESHOLD = 10;

export type RepoSortMode = 'default' | 'latest' | 'popular';

export function getRepoScore(repo: Repository): number {
  const stars = repo.stargazers_count ?? 0;
  const watchers = repo.watchers_count ?? 0;
  const forks = repo.forks_count ?? 0;
  return (
    stars * SCORE_WEIGHTS.stars + watchers * SCORE_WEIGHTS.watchers + forks * SCORE_WEIGHTS.forks
  );
}

export function sortRepositoriesDefault(repositories: Repository[]): Repository[] {
  const pinned: Repository[] = [];
  const others: Repository[] = [];

  repositories.forEach((repo) => {
    if (getRepoScore(repo) > PINNED_SCORE_THRESHOLD) {
      pinned.push(repo);
    } else {
      others.push(repo);
    }
  });

  pinned.sort((a, b) => {
    const scoreA = getRepoScore(a);
    const scoreB = getRepoScore(b);
    if (scoreA === scoreB) {
      return comparePushedAtDesc(a, b);
    }
    return scoreB - scoreA;
  });

  others.sort(comparePushedAtDesc);
  return [...pinned, ...others];
}

export function sortRepositoriesByScoreOnly(repositories: Repository[]): Repository[] {
  return [...repositories].sort((a, b) => getRepoScore(b) - getRepoScore(a));
}

export function sortRepositoriesByPushedAt(repositories: Repository[]): Repository[] {
  return [...repositories].sort(comparePushedAtDesc);
}

function comparePushedAtDesc(a: Repository, b: Repository): number {
  if (parseISO(a.pushed_at) < parseISO(b.pushed_at)) {
    return 1;
  }
  if (parseISO(a.pushed_at) > parseISO(b.pushed_at)) {
    return -1;
  }
  return 0;
}
