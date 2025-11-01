import { isAfter } from 'date-fns/isAfter';
import { parseISO } from 'date-fns/parseISO';
import groupBy from 'lodash.groupby';
import { useRouter } from 'next/router';

import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import Post from '@/components/posts';
import ResumeSection from '@/components/section';
import GridTimeline from '@/components/timeline';
import { primaryTitle } from '@/src/lib/constants';
import { getSortedPostsData } from '@/src/lib/posts';
import Resume, { Activity, Education, Experience, Project } from '@/types/profile';

export default function Index({ allPostsData }: { allPostsData: Resume[] }) {
  const { defaultLocale, locale } = useRouter();
  const isHome = defaultLocale === locale;

  allPostsData = allPostsData.filter((resume) =>
    isAfter(parseISO(resume.startAt), new Date(2022, 1, 1)),
  );
  const groupedPosts = groupBy(allPostsData, (resume: Resume) => resume.type);
  const experience = groupedPosts.experience as Experience[];
  const project = groupedPosts.project as Project[];
  const activity = groupedPosts.activity as Activity[];
  const education = groupedPosts.education as Education[];
  return (
    <Layout title={isHome ? primaryTitle : 'Home'}>
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
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
