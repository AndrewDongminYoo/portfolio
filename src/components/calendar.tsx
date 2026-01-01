'use client';

import './calendar.css';

import { useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

import ResumeSection from '@/components/section';
import { username } from '@/lib/constants';

const MOBILE_QUERY = '(max-width: 767px)';

export default function ReactGithubCalendar() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
    const handleChange = () => applyCalendarLayout(mediaQuery.matches);

    handleChange();

    const observer = new MutationObserver(handleChange);
    observer.observe(container, { childList: true, subtree: true });
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
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
          theme={{
            light: ['#0a3069', '#0969da', '#54aeff', '#b6e3ff', '#eff2f5'],
            dark: ['#151b23', '#0c2d6b', '#1158c7', '#58a6ff', '#cae8ff'],
          }}
        />
      </div>
    </ResumeSection>
  );
}
