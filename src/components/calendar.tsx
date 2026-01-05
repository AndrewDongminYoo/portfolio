'use client';

import './calendar.css';

import { useEffect, useRef, useState } from 'react';

import type { ContributionSummary } from '@/components/contributions/shared';
import ContributionsSummary from '@/components/contributions-summary';
import GitHubContributionCalendar from '@/components/github-contribution-calendar';
import ResumeSection from '@/components/section';

export default function ReactGithubCalendar() {
  const didFetchRef = useRef(false);

  const [summary, setSummary] = useState<ContributionSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    // dev(Strict Mode)에서 이펙트 중복 호출 방지용 가드
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    let isActive = true;
    const controller = new AbortController();

    const run = async () => {
      setSummaryLoading(true);
      setSummaryError(null);

      try {
        const response = await fetch('/api/github/contributions', {
          signal: controller.signal,
          cache: 'no-store',
        });

        const data = (await response.json()) as ContributionSummary;

        if (!isActive) return;

        if (!response.ok || data?.error) {
          setSummary(null);
          setSummaryError(data?.error ?? 'GitHub 기여 데이터를 불러오지 못했습니다.');
          return;
        }

        setSummary(data);
      } catch {
        if (!isActive) return;
        setSummary(null);
        setSummaryError('GitHub 기여 데이터를 불러오지 못했습니다.');
      } finally {
        if (isActive) setSummaryLoading(false);
      }
    };

    run();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  return (
    <ResumeSection key={`${1}-contributions`} type='contributions'>
      <GitHubContributionCalendar />
      <ContributionsSummary summary={summary} loading={summaryLoading} error={summaryError} />
    </ResumeSection>
  );
}
