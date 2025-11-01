import { isAfter } from 'date-fns/isAfter';
import { parseISO } from 'date-fns/parseISO';
import groupBy from 'lodash.groupby';
import Link from 'next/link';

import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import ResumeSection from '@/components/section';
import GridTimeline from '@/components/timeline';
import Post from '@/features/posts';
import Resume, { Activity, Education, Experience, Project } from '@/interface/profile';
import { getSortedPostsData } from '@/lib/posts';

export default function Index() {
  const allPostsData = getSortedPostsData().filter((resume) =>
    isAfter(parseISO(resume.startAt), new Date(2022, 1, 1)),
  );
  const groupedPosts = groupBy(allPostsData, (resume: Resume) => resume.type);
  const experience = groupedPosts.experience as Experience[];
  const project = groupedPosts.project as Project[];
  const activity = groupedPosts.activity as Activity[];
  const education = groupedPosts.education as Education[];
  return (
    <Layout>
      <ResumeSection key={`${0}-timeline`} type='timeline'>
        <GridTimeline timeline={allPostsData} />
      </ResumeSection>
      <ReactGithubCalendar />
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
      <Link href='/' className='leading-8 font-extrabold'>
        🔙 {'홈으로가기'}
      </Link>
    </Layout>
  );
}
