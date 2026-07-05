import { Octokit } from '@octokit/core';
import { NextResponse } from 'next/server';

import { username } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RepoEntry = {
  repository: {
    nameWithOwner: string;
    url: string;
    owner: {
      login: string;
      avatarUrl: string;
      url: string;
    };
    languages: {
      nodes: Array<{
        name: string;
      }>;
    };
    repositoryTopics: {
      nodes: Array<{
        topic: {
          name: string;
        };
      }>;
    };
    stargazerCount: number;
    forkCount: number;
    watchers: {
      totalCount: number;
    };
  };
  contributions: {
    totalCount: number;
  };
};

type ContributionsCollection = {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  commitContributionsByRepository: RepoEntry[];
  issueContributionsByRepository: RepoEntry[];
  pullRequestContributionsByRepository: RepoEntry[];
  pullRequestReviewContributionsByRepository: RepoEntry[];
};

type RepoSummary = {
  nameWithOwner: string;
  url: string;
  owner: {
    login: string;
    avatarUrl: string;
    url: string;
  };
  language?: string;
  stars: number;
  forks: number;
  watchers: number;
  topics: string[];
  total: number;
  breakdown: {
    commits: number;
    issues: number;
    pullRequests: number;
    reviews: number;
  };
};

const MAX_REPOS = 60;
const MAX_TOP_REPOS = 12;
const MAX_EXTERNAL_REPOS = 12;
const MAX_EXTERNAL_OWNERS = 8;

const query = `
  query($login: String!, $from: DateTime!, $to: DateTime!, $maxRepos: Int!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        commitContributionsByRepository(maxRepositories: $maxRepos) {
          repository {
            nameWithOwner
            url
            owner { login avatarUrl url }
            languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
              nodes { name }
            }
            repositoryTopics(first: 20) {
              nodes { topic { name } }
            }
            stargazerCount
            forkCount
            watchers { totalCount }
          }
          contributions { totalCount }
        }
        issueContributionsByRepository(maxRepositories: $maxRepos) {
          repository {
            nameWithOwner
            url
            owner { login avatarUrl url }
            languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
              nodes { name }
            }
            repositoryTopics(first: 20) {
              nodes { topic { name } }
            }
            stargazerCount
            forkCount
            watchers { totalCount }
          }
          contributions { totalCount }
        }
        pullRequestContributionsByRepository(maxRepositories: $maxRepos) {
          repository {
            nameWithOwner
            url
            owner { login avatarUrl url }
            languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
              nodes { name }
            }
            repositoryTopics(first: 20) {
              nodes { topic { name } }
            }
            stargazerCount
            forkCount
            watchers { totalCount }
          }
          contributions { totalCount }
        }
        pullRequestReviewContributionsByRepository(maxRepositories: $maxRepos) {
          repository {
            nameWithOwner
            url
            owner { login avatarUrl url }
            languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
              nodes { name }
            }
            repositoryTopics(first: 20) {
              nodes { topic { name } }
            }
            stargazerCount
            forkCount
            watchers { totalCount }
          }
          contributions { totalCount }
        }
      }
    }
  }
`;

const getRange = () => {
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(to.getFullYear() - 1);
  return { from, to };
};

export async function GET() {
  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'Missing GITHUB_TOKEN' }, { status: 200 });
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  const { from, to } = getRange();

  try {
    const response = await octokit.request('POST /graphql', {
      query,
      variables: {
        login: username,
        from: from.toISOString(),
        to: to.toISOString(),
        maxRepos: MAX_REPOS,
      },
    });

    const body = response.data as {
      data?: { user?: { contributionsCollection?: ContributionsCollection } };
      errors?: Array<{ message: string }>;
    };

    if (body.errors?.length) {
      return NextResponse.json(
        { error: body.errors[0]?.message ?? 'GraphQL error.' },
        { status: 200 },
      );
    }

    if (!body.data?.user) {
      return NextResponse.json({ error: 'GitHub user not found.' }, { status: 200 });
    }

    const collection = body.data.user.contributionsCollection;

    if (!collection) {
      return NextResponse.json({ error: 'No contributions data available.' }, { status: 200 });
    }

    const repoMap = new Map<string, RepoSummary>();
    const merge = (items: RepoEntry[], key: keyof RepoSummary['breakdown']) => {
      items.forEach((item) => {
        const name = item.repository.nameWithOwner;
        const count = item.contributions.totalCount;
        const current = repoMap.get(name) ?? {
          nameWithOwner: name,
          url: item.repository.url,
          owner: item.repository.owner,
          language: item.repository.languages?.nodes?.[0]?.name,
          stars: item.repository.stargazerCount ?? 0,
          forks: item.repository.forkCount ?? 0,
          watchers: item.repository.watchers?.totalCount ?? 0,
          topics: (item.repository.repositoryTopics?.nodes ?? []).map((node) => node.topic.name),
          total: 0,
          breakdown: { commits: 0, issues: 0, pullRequests: 0, reviews: 0 },
        };
        current.breakdown[key] += count;
        current.total += count;
        repoMap.set(name, current);
      });
    };

    merge(collection.commitContributionsByRepository ?? [], 'commits');
    merge(collection.issueContributionsByRepository ?? [], 'issues');
    merge(collection.pullRequestContributionsByRepository ?? [], 'pullRequests');
    merge(collection.pullRequestReviewContributionsByRepository ?? [], 'reviews');

    const allRepos = Array.from(repoMap.values()).sort((a, b) => b.total - a.total);
    const repos = allRepos.slice(0, MAX_TOP_REPOS);
    const selfLogin = username.toLowerCase();
    const externalReposAll = allRepos.filter(
      (repo) => repo.owner.login.toLowerCase() !== selfLogin,
    );
    const externalRepos = externalReposAll.slice(0, MAX_EXTERNAL_REPOS);
    const ownerMap = new Map<
      string,
      { login: string; avatarUrl: string; url: string; total: number }
    >();
    externalReposAll.forEach((repo) => {
      const login = repo.owner.login;
      const current = ownerMap.get(login) ?? {
        login,
        avatarUrl: repo.owner.avatarUrl,
        url: repo.owner.url,
        total: 0,
      };
      current.total += repo.total;
      ownerMap.set(login, current);
    });
    const externalOwners = Array.from(ownerMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, MAX_EXTERNAL_OWNERS);

    const totals = {
      commits: collection.totalCommitContributions ?? 0,
      issues: collection.totalIssueContributions ?? 0,
      pullRequests: collection.totalPullRequestContributions ?? 0,
      reviews: collection.totalPullRequestReviewContributions ?? 0,
    };

    return NextResponse.json({
      range: { from: from.toISOString(), to: to.toISOString() },
      totals: { ...totals, total: Object.values(totals).reduce((sum, value) => sum + value, 0) },
      repos,
      externalRepos,
      externalOwners,
    });
  } catch (error) {
    console.error('[github/contributions] Failed to fetch:', error);
    return NextResponse.json({ error: 'Failed to fetch contributions.' }, { status: 200 });
  }
}
