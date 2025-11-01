import './calendar.css';

import GitHubCalendar from 'react-github-calendar';

import ResumeSection from '@/components/section';
import { username } from '@/lib/constants';

export default function ReactGithubCalendar() {
  return (
    <ResumeSection key={`${1}-contributions`} type='contributions'>
      <GitHubCalendar
        username={username}
        blockSize={10}
        style={{ paddingTop: 10, width: '100%' }}
        fontSize={12}
        hideColorLegend={false}
        theme={{
          light: ['#0a3069', '#0969da', '#54aeff', '#b6e3ff', '#eff2f5'],
          dark: ['#151b23', '#0c2d6b', '#1158c7', '#58a6ff', '#cae8ff'],
        }}
      />
    </ResumeSection>
  );
}
