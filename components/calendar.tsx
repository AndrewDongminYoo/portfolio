import GitHubCalendar from 'react-github-calendar';
import ResumeSection from 'components/section';
import { username } from '@/constants/';

export default function ReactGithubCalendar() {
  return (
    <ResumeSection key={`${1}-contributions`} type='contributions'>
      <GitHubCalendar
        username={username}
        blockSize={9.4}
        style={{ color: 'lightGray', paddingTop: 10 }}
        fontSize={11}
        hideColorLegend={true}
        theme={{
          light: ['#EBEDF0', '#B6E3FF', '#54AEFF', '#0969DA', '#0A3069'],
        }}
      />
    </ResumeSection>
  );
}
