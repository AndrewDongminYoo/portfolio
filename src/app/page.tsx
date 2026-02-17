import groupBy from 'lodash.groupby';

import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import ResumeSection from '@/components/section';
import GridTimeline from '@/components/timeline';
import AppList from '@/features/apps/app-list';
import Post from '@/features/posts';
import Resume, { Activity, Education, Experience, Project } from '@/interface/profile';
import { getApps } from '@/lib/apps';
import { getSortedPostsData } from '@/lib/posts';

export default function Index() {
  const allPostsData = getSortedPostsData();
  const groupedPosts = groupBy(allPostsData, (resume: Resume) => resume.type);
  const experience = groupedPosts.experience as Experience[];
  const project = groupedPosts.project as Project[];
  const activity = groupedPosts.activity as Activity[];
  const education = groupedPosts.education as Education[];
  const apps = getApps();
  return (
    <Layout>
      <ResumeSection key={`${0}-timeline`} type='timeline'>
        <GridTimeline timeline={experience} />
      </ResumeSection>
      <ReactGithubCalendar />
      <ResumeSection key={`${1}-deployments`} type='deployments'>
        <AppList apps={apps} />
      </ResumeSection>
      <ResumeSection key={`${2}-experiences`} type='experiences'>
        {experience &&
          experience.map((data, key) => {
            return <Post data={data} key={`${key}-experience`} />;
          })}
      </ResumeSection>
      <ResumeSection key={`${3}-projects`} type='projects'>
        {project &&
          project.map((data, key) => {
            return <Post data={data} key={`${key}-project`} />;
          })}
      </ResumeSection>
      <ResumeSection key={`${4}-activities`} type='activities'>
        {activity &&
          activity.map((data, key) => {
            return <Post data={data} key={`${key}-activity`} />;
          })}
      </ResumeSection>
      <ResumeSection key={`${5}-educations`} type='educations'>
        {education &&
          education.map((data, key) => {
            return <Post data={data} key={`${key}-education`} />;
          })}
      </ResumeSection>
    </Layout>
  );
}
