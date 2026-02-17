'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import {
  buildBreakdown,
  buildRepoStats,
  buildTotalParts,
  type ContributionSummary,
  displayRepoName,
  formatCount,
  formatDateLabel,
} from '@/components/contributions/shared';
import { getRepoAccentStyle, getRepoIconStyle } from '@/components/contributions/styles';

type Props = {
  summary: ContributionSummary | null;
  loading: boolean;
  error: string | null;
};

export default function ContributionsSummary({ summary, loading, error }: Props) {
  const rankedRepos = useMemo(() => {
    if (!summary) return [];
    return summary.repos
      .map((repo) => ({ repo, score: repo.stars + repo.watchers + repo.forks }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.repo);
  }, [summary]);

  return (
    <>
      {!loading && !error && summary && (
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
                  className='hover:bg-accent/10 flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-2 py-1 text-xxs font-medium transition-colors'>
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
            <p className='text-muted-foreground text-xxs'>외부 컨트리뷰션이 없습니다.</p>
          )}

          {summary.externalRepos && summary.externalRepos.length > 0 && (
            <div className='grid gap-2 md:grid-cols-2'>
              {summary.externalRepos.map((repo) => {
                const breakdown = buildBreakdown(repo.breakdown);
                const accentStyle = getRepoAccentStyle(repo);

                return (
                  <Link
                    key={repo.nameWithOwner}
                    href={repo.url}
                    target='_blank'
                    rel='noopener'
                    style={accentStyle}
                    className='hover:bg-accent/10 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-left shadow-sm transition-colors'>
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
                      <div className='text-muted-foreground mt-1 flex flex-wrap gap-2 text-xxs'>
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
            <span className='text-muted-foreground text-xxs'>
              {formatDateLabel(summary.range.from)} ~ {formatDateLabel(summary.range.to)}
            </span>
          )}
        </div>

        {loading && (
          <p className='text-muted-foreground text-xxs'>기여 데이터를 불러오는 중입니다.</p>
        )}

        {!loading && error && (
          <p className='text-muted-foreground text-xxs'>
            프로젝트별 기여 요약을 표시할 수 없습니다. {error}
          </p>
        )}

        {!loading && !error && summary && (
          <>
            <div className='text-muted-foreground text-xxs'>
              <span>총 {formatCount(summary.totals.total)}</span>
              {buildTotalParts(summary.totals).map((part) => (
                <span key={part}> · {part}</span>
              ))}
            </div>

            {rankedRepos.length === 0 ? (
              <p className='text-muted-foreground text-xxs'>표시할 프로젝트가 없습니다.</p>
            ) : (
              <div className='grid gap-2 md:grid-cols-2'>
                {rankedRepos.map((repo) => {
                  const stats = buildRepoStats(repo);
                  const iconStyle = getRepoIconStyle(repo);

                  return (
                    <Link
                      key={repo.nameWithOwner}
                      href={repo.url}
                      target='_blank'
                      rel='noopener'
                      className='hover:bg-accent/10 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-left shadow-sm transition-colors'>
                      <div className='flex items-center justify-between gap-2 text-sm font-medium'>
                        <span className='truncate'>{displayRepoName(repo)}</span>
                        <span className='text-muted-foreground text-xxs'>
                          {formatCount(repo.total)}
                        </span>
                      </div>

                      <div className='text-muted-foreground mt-1 flex w-full items-center gap-2 text-xxs'>
                        <div className='flex min-w-0 flex-wrap gap-2'>
                          {stats.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>

                        <span
                          className='ml-auto h-4 w-4 shrink-0'
                          style={iconStyle}
                          aria-hidden='true'
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
