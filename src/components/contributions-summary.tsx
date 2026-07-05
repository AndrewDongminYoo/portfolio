'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import {
  buildEcosystemDistribution,
  classifyEcosystem,
  type EcosystemKey,
  ECOSYSTEMS,
} from '@/components/contributions/ecosystems';
import {
  buildBreakdown,
  buildLanguageDistribution,
  buildRepoStats,
  buildTotalParts,
  type ContributionRepo,
  type ContributionSummary,
  displayRepoName,
  formatCount,
  formatDateLabel,
} from '@/components/contributions/shared';
import { getRepoAccentStyle, getRepoIconStyle } from '@/components/contributions/styles';
import LanguageStateBar from '@/features/repos/langs-bar';
import { getSimpleIcon } from '@/features/repos/simple-icons';
import { username } from '@/lib/constants';

type Props = {
  summary: ContributionSummary | null;
  loading: boolean;
  error: string | null;
};

export default function ContributionsSummary({ summary, loading, error }: Props) {
  // Repos classified into an ecosystem, drawn from both self and external
  // contributions and deduplicated by name. This pool feeds both the ecosystem
  // chips (whole pool) and the ranked list below (top slice by contribution).
  const ecosystemPool = useMemo(() => {
    if (!summary) return [] as Array<ContributionRepo & { ecosystem: EcosystemKey }>;
    const seen = new Set<string>();
    const pool: Array<ContributionRepo & { ecosystem: EcosystemKey }> = [];
    for (const repo of [...summary.repos, ...(summary.externalRepos ?? [])]) {
      if (seen.has(repo.nameWithOwner)) continue;
      const ecosystem = classifyEcosystem(repo);
      if (!ecosystem) continue;
      seen.add(repo.nameWithOwner);
      pool.push({ ...repo, ecosystem });
    }
    return pool;
  }, [summary]);

  const ecosystemStats = useMemo(() => buildEcosystemDistribution(ecosystemPool), [ecosystemPool]);

  const rankedRepos = useMemo(
    () => [...ecosystemPool].sort((a, b) => b.total - a.total).slice(0, 8),
    [ecosystemPool],
  );

  const languageDistribution = useMemo(
    () => (summary ? buildLanguageDistribution(summary.repos) : null),
    [summary],
  );

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
          <span>오픈소스 생태계 기여</span>
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

            {ecosystemStats.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {ecosystemStats.map((stat) => (
                  <span
                    key={stat.key}
                    className='inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2 py-1 text-xxs font-medium'>
                    <span
                      className='inline-block h-2 w-2 rounded-full'
                      style={{ backgroundColor: stat.color }}
                      aria-hidden='true'
                    />
                    <span>{stat.label}</span>
                    <span className='text-muted-foreground'>×{stat.count}</span>
                  </span>
                ))}
              </div>
            )}

            {languageDistribution && languageDistribution.stats.length > 0 && (
              <div className='flex flex-col gap-2'>
                <span className='text-xxs font-medium'>주력 언어 (기여 기준)</span>
                <LanguageStateBar
                  languages={languageDistribution.entries}
                  totalCount={languageDistribution.total}
                />
                <ul className='m-0 flex list-none flex-wrap gap-x-5 gap-y-2 px-0 py-0'>
                  {languageDistribution.stats.map((stat) => (
                    <li
                      key={stat.language}
                      className='text-muted-foreground flex items-center gap-1.5 text-xxs'>
                      <span
                        className='inline-block h-2 w-2 rounded-full'
                        style={{
                          backgroundColor: getSimpleIcon(stat.language)?.color ?? '#999999',
                        }}
                        aria-hidden='true'
                      />
                      <span>{stat.language}</span>
                      <span className='opacity-70'>{stat.percent.toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rankedRepos.length === 0 ? (
              <p className='text-muted-foreground text-xxs'>
                생태계 기여로 분류된 프로젝트가 없습니다.
              </p>
            ) : (
              <div className='grid gap-2 md:grid-cols-2'>
                {rankedRepos.map((repo) => {
                  const eco = ECOSYSTEMS[repo.ecosystem];
                  const isMaintainer = repo.owner.login.toLowerCase() === username.toLowerCase();
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
                        <span
                          className='inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-xxs font-medium'
                          style={{ backgroundColor: `${eco.color}1f` }}>
                          <span
                            className='inline-block h-1.5 w-1.5 rounded-full'
                            style={{ backgroundColor: eco.color }}
                            aria-hidden='true'
                          />
                          {eco.label}
                        </span>
                      </div>

                      <div className='text-muted-foreground mt-1 flex w-full items-center gap-2 text-xxs'>
                        <span className='rounded border border-border/60 px-1.5 py-0.5 font-medium'>
                          {isMaintainer ? '메인테이너' : '기여'}
                        </span>
                        <div className='flex min-w-0 flex-wrap gap-2'>
                          {stats.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                          <span>기여 {formatCount(repo.total)}</span>
                        </div>

                        <span
                          className='ml-auto h-4 w-4 shrink-0'
                          style={iconStyle}
                          data-testid='repo-lang-icon'
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
