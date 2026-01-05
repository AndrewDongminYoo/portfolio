import { username } from '@/lib/constants';

export type ContributionTotals = {
  commits: number;
  issues: number;
  pullRequests: number;
  reviews: number;
  total: number;
};

export type ContributionOwner = {
  login: string;
  avatarUrl: string;
  url: string;
  total?: number;
};

export type ContributionRepo = {
  nameWithOwner: string;
  url: string;
  owner: ContributionOwner;
  language?: string;
  stars: number;
  forks: number;
  watchers: number;
  total: number;
  breakdown: {
    commits: number;
    issues: number;
    pullRequests: number;
    reviews: number;
  };
};

export type ContributionSummary = {
  range: { from: string; to: string };
  totals: ContributionTotals;
  repos: ContributionRepo[];
  externalRepos?: ContributionRepo[];
  externalOwners?: ContributionOwner[];
  error?: string;
};

const numberFormat = new Intl.NumberFormat('ko-KR');

export const formatDateLabel = (value: string) => {
  const [date] = value.split('T');
  const [y, m, d] = date.split('-');
  if (!y || !m || !d) return value;
  return `${y}.${m}.${d}`;
};

export const formatCount = (count: number) => `${numberFormat.format(count)}회`;
export const formatMetric = (count: number) => numberFormat.format(count);

export const buildBreakdown = (breakdown: ContributionRepo['breakdown']) => {
  const items = [
    { label: '커밋', value: breakdown.commits },
    { label: 'PR', value: breakdown.pullRequests },
    { label: '리뷰', value: breakdown.reviews },
    { label: '이슈', value: breakdown.issues },
  ];
  return items.filter((x) => x.value > 0).map((x) => `${x.label} ${formatCount(x.value)}`);
};

export const buildTotalParts = (totals: ContributionTotals) => {
  const items = [
    { label: '커밋', value: totals.commits },
    { label: 'PR', value: totals.pullRequests },
    { label: '리뷰', value: totals.reviews },
    { label: '이슈', value: totals.issues },
  ];
  return items.filter((x) => x.value > 0).map((x) => `${x.label} ${formatCount(x.value)}`);
};

export const buildRepoStats = (repo: ContributionRepo) => {
  const items = [
    { label: 'stars', value: repo.stars },
    { label: 'watchers', value: repo.watchers },
    { label: 'forks', value: repo.forks },
  ];
  return items.filter((x) => x.value > 0).map((x) => `${formatMetric(x.value)} ${x.label}`);
};

export const displayRepoName = (repo: ContributionRepo) => {
  const ownerLogin = repo.owner.login.toLowerCase();
  const selfLogin = username.toLowerCase();
  if (ownerLogin === selfLogin) {
    const [, name] = repo.nameWithOwner.split('/');
    return name ?? repo.nameWithOwner;
  }
  return repo.nameWithOwner;
};
