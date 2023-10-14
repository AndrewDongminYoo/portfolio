import type { GetStaticPropsContext, PreviewData } from 'next';
import Resume, { Activity, Education, Experience, Project } from 'types/profile';
import GridTimeline from 'components/timeline';
import Layout from 'components/layout';
import { ParsedUrlQuery } from 'querystring';
import Post from 'components/posts';
import ReactGithubCalendar from 'components/calendar';
import ResumeSection from 'components/section';
import { getSortedPostsData } from 'lib/posts';
import groupBy from 'lodash.groupby';
import isAfter from 'date-fns/isAfter';
import parse from 'date-fns/parseISO';
import { primaryTitle } from '@/constants/';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

export default function Index({ allPostsData }: { allPostsData: Resume[] }) {
  const t = useTranslations('Index');
  const { defaultLocale, locale } = useRouter();
  const isHome = defaultLocale === locale;

  allPostsData = allPostsData.filter((resume) =>
    isAfter(parse(resume.startAt), new Date(2022, 1, 1)),
  );
  const groupedPosts = groupBy(allPostsData, (resume: Resume) => resume.type);
  const experience = groupedPosts.experience as Experience[];
  const project = groupedPosts.project as Project[];
  const activity = groupedPosts.activity as Activity[];
  const education = groupedPosts.education as Education[];
  return (
    <Layout title={isHome ? primaryTitle : t('title')}>
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

export async function getStaticProps(context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>) {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
      /// 원하는 곳 어디에서나 메시지를 받을 수 있습니다.
      /// 권장되는 패턴은 로캘별로 구분된 JSON 파일에 넣고 Next.js에서 받은 `로캘`에 따라 Next.js에서 받은 `로캘`을 기준으로 원하는 로캘을 읽는 것입니다.
      messages: (await import(`../messages/${context.locale}.json`)).default,
    },
  };
}
