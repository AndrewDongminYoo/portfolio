import GitHubCalendar from 'github-calendar';
import ResumeSection from 'components/section';
import Script from 'next/script';
import { username } from '@/constants/';

function onLoad() {
  if (typeof GitHubCalendar === 'function') {
    try {
      GitHubCalendar('.calendar', username, {
        responsive: true,
        global_stats: true,
        tooltips: true,
        cache: 24 * 60 * 60 * 1000,
      });
    } catch (e) {
      throw 'Cannot Load GitHubCalendar';
    }
  }
}

export default function ReactGithubCalendar() {
  return (
    <Script id='github-calendar' title='github-calendar' onLoad={onLoad}>
      <ResumeSection key={`${1}-contributions`} type='contributions'>
        <div className='calendar' />
      </ResumeSection>
    </Script>
  );
}
