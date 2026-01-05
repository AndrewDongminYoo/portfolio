'use client';

import 'react-activity-calendar/tooltips.css';
import './calendar.css';

import { useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

import { formatCount, formatDateLabel } from '@/components/contributions/shared';
import { username } from '@/lib/constants';

const MOBILE_QUERY = '(max-width: 767px)';

function useAutoScrollToLatest(containerRef: React.RefObject<HTMLDivElement | null>) {
  const didInitRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    let rafId = 0;

    const getScrollTarget = () =>
      container.querySelector<HTMLDivElement>('.react-activity-calendar__scroll-container') ??
      container;

    const tryScrollToLatest = () => {
      if (didInitRef.current) return;

      const target = getScrollTarget();
      const maxLeft = target.scrollWidth - target.clientWidth;

      if (maxLeft > 0) {
        target.scrollLeft = maxLeft;
        didInitRef.current = true;
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        tryScrollToLatest();
      });
    };

    // 사용자가 먼저 스크롤했으면 자동 스크롤 개입 중단
    const target = getScrollTarget();
    const onUserScroll = () => {
      didInitRef.current = true;
      target.removeEventListener('scroll', onUserScroll);
    };
    target.addEventListener('scroll', onUserScroll, { passive: true });

    schedule();

    const ro = new ResizeObserver(schedule);
    ro.observe(container);

    const onMediaChange = () => schedule();
    mediaQuery.addEventListener('change', onMediaChange);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      mediaQuery.removeEventListener('change', onMediaChange);
      target.removeEventListener('scroll', onUserScroll);
    };
  }, [containerRef]);
}

export default function GitHubContributionCalendar() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useAutoScrollToLatest(containerRef);

  return (
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
  );
}
