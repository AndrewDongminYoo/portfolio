'use client';

import 'react-activity-calendar/tooltips.css';
import './calendar.css';

import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

import ResumeSection from '@/components/section';
import { getSimpleIcon } from '@/features/repos/simple-icons';
import { username } from '@/lib/constants';

const MOBILE_QUERY = '(max-width: 767px)';

type ContributionTotals = {
  commits: number;
  issues: number;
  pullRequests: number;
  reviews: number;
  total: number;
};

type ContributionOwner = {
  login: string;
  avatarUrl: string;
  url: string;
  total?: number;
};

type ContributionRepo = {
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

type ContributionSummary = {
  range: {
    from: string;
    to: string;
  };
  totals: ContributionTotals;
  repos: ContributionRepo[];
  externalRepos?: ContributionRepo[];
  externalOwners?: ContributionOwner[];
  error?: string;
};

const formatDateLabel = (value: string) => {
  const [date] = value.split('T');
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) return value;
  return `${year}.${month}.${day}`;
};

const formatCount = (count: number) => `${count.toLocaleString()}회`;
const formatMetric = (count: number) => count.toLocaleString();

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex.startsWith('#')) return undefined;
  const normalized = hex.slice(1);
  if (![3, 6].includes(normalized.length)) return undefined;
  const chunk = normalized.length === 3;
  const toChannel = (value: string) => parseInt(chunk ? value.repeat(2) : value, 16);
  const r = toChannel(normalized.slice(0, chunk ? 1 : 2));
  const g = toChannel(normalized.slice(chunk ? 1 : 2, chunk ? 2 : 4));
  const b = toChannel(normalized.slice(chunk ? 2 : 4, chunk ? 3 : 6));
  if ([r, g, b].some((value) => Number.isNaN(value))) return undefined;
  return `rgba(${r}, ${g}, ${b}, ${Math.min(Math.max(alpha, 0), 1)})`;
};

const getRepoAccentStyle = (repo: ContributionRepo) => {
  const language = repo.language;
  if (!language) return undefined;

  const icon = getSimpleIcon(language);
  const color = icon?.color; // ✅ '#RRGGBB' only
  if (!color) return undefined;

  const line = hexToRgba(color, 0.5);
  if (!line) return undefined;

  return { boxShadow: `inset -3px 0 0 0 ${line}` } as CSSProperties;
};

const getRepoIconStyle = (repo: ContributionRepo) => {
  const language = repo.language;
  if (!language) return undefined;

  const icon = getSimpleIcon(language);
  if (!icon?.color) return undefined;

  // 아이콘 URL 없으면 색상만이라도 보여주고 싶다면 여기서 fallback 가능
  if (!icon.url) return { backgroundColor: icon.color } as CSSProperties;

  return {
    backgroundColor: icon.color,
    WebkitMaskImage: `url(${icon.url})`,
    maskImage: `url(${icon.url})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  } as CSSProperties;
};

const buildBreakdown = (breakdown: ContributionRepo['breakdown']) => {
  const items = [
    { label: '커밋', value: breakdown.commits },
    { label: 'PR', value: breakdown.pullRequests },
    { label: '리뷰', value: breakdown.reviews },
    { label: '이슈', value: breakdown.issues },
  ];
  return items
    .filter((item) => item.value > 0)
    .map((item) => `${item.label} ${formatCount(item.value)}`);
};

const buildTotalParts = (totals: ContributionTotals) => {
  const items = [
    { label: '커밋', value: totals.commits },
    { label: 'PR', value: totals.pullRequests },
    { label: '리뷰', value: totals.reviews },
    { label: '이슈', value: totals.issues },
  ];
  return items
    .filter((item) => item.value > 0)
    .map((item) => `${item.label} ${formatCount(item.value)}`);
};

const buildRepoStats = (repo: ContributionRepo) => {
  const items = [
    { label: 'stars', value: repo.stars },
    { label: 'watch', value: repo.watchers },
    { label: 'forks', value: repo.forks },
  ];
  return items
    .filter((item) => item.value > 0)
    .map((item) => `${formatMetric(item.value)} ${item.label}`);
};

const displayRepoName = (repo: ContributionRepo) => {
  const ownerLogin = repo.owner.login.toLowerCase();
  const selfLogin = username.toLowerCase();
  if (ownerLogin === selfLogin) {
    const [, name] = repo.nameWithOwner.split('/');
    return name ?? repo.nameWithOwner;
  }
  return repo.nameWithOwner;
};

export default function ReactGithubCalendar() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const didInitScrollRef = useRef(false);
  const [summary, setSummary] = useState<ContributionSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollToLatest = () => {
      // If the user scrolled manually, do not interfere (remove if desired)
      if (didInitScrollRef.current) return;

      // Use rAF twice to ensure scrollWidth calculation reflects DOM updates correctly
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const scrollTarget =
            container.querySelector<HTMLDivElement>('.react-activity-calendar__scroll-container') ??
            container;
          const maxLeft = scrollTarget.scrollWidth - scrollTarget.clientWidth;
          if (maxLeft > 0) {
            scrollTarget.scrollLeft = maxLeft;
            didInitScrollRef.current = true;
          }
        });
      });
    };

    const applyCalendarLayout = (isMobile: boolean) => {
      const calendar = container.querySelector<SVGSVGElement>('.react-activity-calendar__calendar');
      if (!calendar) return;

      if (isMobile) {
        calendar.style.setProperty('width', 'auto', 'important');
        calendar.style.setProperty('max-width', 'none', 'important');
        calendar.style.setProperty('overflow', 'visible', 'important');
      } else {
        calendar.style.removeProperty('width');
        calendar.style.removeProperty('max-width');
        calendar.style.removeProperty('overflow');
      }
    };

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => {
      applyCalendarLayout(mediaQuery.matches);
      scrollToLatest();
    };

    handleChange();

    const mo = new MutationObserver(handleChange);
    mo.observe(container, { childList: true, subtree: true });

    const ro = new ResizeObserver(handleChange);
    ro.observe(container);

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mo.disconnect();
      ro.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        const response = await fetch('/api/github/contributions', {
          signal: controller.signal,
          cache: 'no-store',
        });
        const data = (await response.json()) as ContributionSummary;
        if (!isActive) return;
        if (!response.ok || data?.error) {
          setSummaryError(data?.error ?? 'GitHub 기여 데이터를 불러오지 못했습니다.');
          return;
        }
        setSummary(data);
      } catch {
        if (!isActive) return;
        setSummaryError('GitHub 기여 데이터를 불러오지 못했습니다.');
      } finally {
        if (isActive) setSummaryLoading(false);
      }
    };

    fetchSummary();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const rankedRepos = summary
    ? summary.repos
        .map((repo) => ({
          repo,
          score: repo.stars + repo.watchers + repo.forks,
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((item) => item.repo)
    : [];

  return (
    <ResumeSection key={`${1}-contributions`} type='contributions'>
      <div className='github-calendar-scroll' ref={containerRef}>
        <GitHubCalendar
          username={username}
          blockSize={10}
          style={{ paddingTop: 10 }}
          fontSize={12}
          tooltips={{
            activity: {
              text: (activity) => {
                const countText =
                  activity.count === 0 ? '기여 없음' : `${formatCount(activity.count)} 기여`;
                return `${formatDateLabel(activity.date)} - ${countText}`;
              },
            },
          }}
          theme={{
            light: ['#0a3069', '#0969da', '#54aeff', '#b6e3ff', '#eff2f5'],
            dark: ['#151b23', '#0c2d6b', '#1158c7', '#58a6ff', '#cae8ff'],
          }}
        />
      </div>
      {!summaryLoading && !summaryError && summary && (
        <div className='mt-4 flex flex-col gap-3'>
          <div className='flex flex-wrap items-center justify-between gap-2 text-sm font-medium'>
            <span>외부 컨트리뷰션</span>
          </div>
          {summary.externalOwners && summary.externalOwners.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {summary.externalOwners.map((owner) => (
                <Link
                  key={owner.login}
                  href={owner.url}
                  target='_blank'
                  rel='noopener'
                  className='border-border/60 bg-background/80 hover:bg-accent/10 text-xxs flex items-center gap-2 rounded-full border px-2 py-1 font-medium transition-colors'>
                  <Image
                    src={owner.avatarUrl}
                    alt={`${owner.login} avatar`}
                    width={18}
                    height={18}
                    className='rounded-full'
                  />
                  <span>@{owner.login}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className='text-xxs text-muted-foreground'>외부 컨트리뷰션이 없습니다.</p>
          )}
          {summary.externalRepos && summary.externalRepos.length > 0 && (
            <div className='grid gap-2 md:grid-cols-2'>
              {summary.externalRepos.map((repo) => {
                const breakdown = buildBreakdown(repo.breakdown);
                return (
                  <Link
                    key={repo.nameWithOwner}
                    href={repo.url}
                    target='_blank'
                    rel='noopener'
                    style={getRepoAccentStyle(repo)}
                    className='border-border/60 bg-background/80 hover:bg-accent/10 rounded-md border px-3 py-2 text-left shadow-sm transition-colors'>
                    <div className='flex items-center gap-2 text-sm font-medium'>
                      <Image
                        src={repo.owner.avatarUrl}
                        alt={`${repo.owner.login} avatar`}
                        width={16}
                        height={16}
                        className='rounded-full'
                      />
                      <span className='truncate'>{repo.nameWithOwner}</span>
                    </div>
                    {breakdown.length > 0 && (
                      <div className='text-xxs text-muted-foreground mt-1 flex flex-wrap gap-2'>
                        {breakdown.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
      <div className='mt-4 flex flex-col gap-3'>
        <div className='flex flex-wrap items-center justify-between gap-2 text-sm font-medium'>
          <span>최근 1년 기여 프로젝트</span>
          {summary?.range && (
            <span className='text-xxs text-muted-foreground'>
              {formatDateLabel(summary.range.from)} ~ {formatDateLabel(summary.range.to)}
            </span>
          )}
        </div>
        {summaryLoading && (
          <p className='text-xxs text-muted-foreground'>기여 데이터를 불러오는 중입니다.</p>
        )}
        {!summaryLoading && summaryError && (
          <p className='text-xxs text-muted-foreground'>
            프로젝트별 기여 요약을 표시할 수 없습니다. {summaryError}
          </p>
        )}
        {!summaryLoading && !summaryError && summary && (
          <>
            <div className='text-xxs text-muted-foreground'>
              <span>총 {formatCount(summary.totals.total)}</span>
              {buildTotalParts(summary.totals).map((part) => (
                <span key={part}> · {part}</span>
              ))}
            </div>
            {rankedRepos.length === 0 ? (
              <p className='text-xxs text-muted-foreground'>표시할 프로젝트가 없습니다.</p>
            ) : (
              <div className='grid gap-2 md:grid-cols-2'>
                {rankedRepos.map((repo) => {
                  const stats = buildRepoStats(repo);
                  return (
                    <Link
                      key={repo.nameWithOwner}
                      href={repo.url}
                      target='_blank'
                      rel='noopener'
                      className='border-border/60 bg-background/80 hover:bg-accent/10 rounded-md border px-3 py-2 text-left shadow-sm transition-colors'>
                      <div className='flex items-center justify-between gap-2 text-sm font-medium'>
                        <span className='truncate'>{displayRepoName(repo)}</span>
                        <span className='text-xxs text-muted-foreground'>
                          {formatCount(repo.total)}
                        </span>
                      </div>
                      <div className='text-xxs text-muted-foreground mt-1 flex w-full items-center gap-2'>
                        <div className='flex min-w-0 flex-wrap gap-2'>
                          {stats.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>
                        <span className='ml-auto h-4 w-4 shrink-0' style={getRepoIconStyle(repo)} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </ResumeSection>
  );
}
