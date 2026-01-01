'use client';

import 'react-activity-calendar/tooltips.css';
import './calendar.css';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

import ResumeSection from '@/components/section';
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
            <span className='text-xxs text-muted-foreground'>내 레포 제외</span>
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
              {summary.externalRepos.map((repo) => (
                <Link
                  key={repo.nameWithOwner}
                  href={repo.url}
                  target='_blank'
                  rel='noopener'
                  className='border-border/60 bg-background/80 hover:bg-accent/10 rounded-md border px-3 py-2 text-left shadow-sm transition-colors'>
                  <div className='flex items-center justify-between gap-2 text-sm font-medium'>
                    <span className='truncate'>{repo.nameWithOwner}</span>
                    <span className='text-xxs text-muted-foreground'>
                      {formatCount(repo.total)}
                    </span>
                  </div>
                  <div className='text-xxs text-muted-foreground mt-1 flex flex-wrap gap-2'>
                    <span>커밋 {formatCount(repo.breakdown.commits)}</span>
                    <span>PR {formatCount(repo.breakdown.pullRequests)}</span>
                    <span>리뷰 {formatCount(repo.breakdown.reviews)}</span>
                    <span>이슈 {formatCount(repo.breakdown.issues)}</span>
                  </div>
                </Link>
              ))}
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
              총 {formatCount(summary.totals.total)} · 커밋 {formatCount(summary.totals.commits)} ·
              PR {formatCount(summary.totals.pullRequests)} · 리뷰{' '}
              {formatCount(summary.totals.reviews)} · 이슈 {formatCount(summary.totals.issues)}
            </div>
            {summary.repos.length === 0 ? (
              <p className='text-xxs text-muted-foreground'>표시할 프로젝트가 없습니다.</p>
            ) : (
              <div className='grid gap-2 md:grid-cols-2'>
                {summary.repos.map((repo) => (
                  <Link
                    key={repo.nameWithOwner}
                    href={repo.url}
                    target='_blank'
                    rel='noopener'
                    className='border-border/60 bg-background/80 hover:bg-accent/10 rounded-md border px-3 py-2 text-left shadow-sm transition-colors'>
                    <div className='flex items-center justify-between gap-2 text-sm font-medium'>
                      <span className='truncate'>{repo.nameWithOwner}</span>
                      <span className='text-xxs text-muted-foreground'>
                        {formatCount(repo.total)}
                      </span>
                    </div>
                    <div className='text-xxs text-muted-foreground mt-1 flex flex-wrap gap-2'>
                      <span>커밋 {formatCount(repo.breakdown.commits)}</span>
                      <span>PR {formatCount(repo.breakdown.pullRequests)}</span>
                      <span>리뷰 {formatCount(repo.breakdown.reviews)}</span>
                      <span>이슈 {formatCount(repo.breakdown.issues)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ResumeSection>
  );
}
