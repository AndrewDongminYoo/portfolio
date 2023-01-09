import type {
    Activity,
    Education,
    Experience,
    Project,
    Resume,
} from '@typings/profile';
import type { GetStaticProps } from 'next';
import GridTimeline from '@components/timeline';
import Head from 'next/head';
import Layout from '@components/layout';
import Post from '@components/posts';
import ReactGitHubCalendar from '@components/calendar';
import ResumeSection from '@components/section';
import { getSortedPostsData } from '@lib/posts';
import groupBy from 'lodash.groupby';
import { primaryTitle } from '@constants';

export default function Home({ allPostsData }: { allPostsData: Resume[] }) {
    const groupedPosts = groupBy(allPostsData, (resume: Resume) => resume.type);
    const experience = groupedPosts.experience as Experience[];
    const project = groupedPosts.project as Project[];
    const activity = groupedPosts.activity as Activity[];
    const education = groupedPosts.education as Education[];
    return (
        <Layout>
            <Head>
                <meta
                    name="keywords"
                    content="서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인"
                />
                <title>{primaryTitle}</title>
            </Head>
            <ResumeSection key={0} type="timeline">
                <GridTimeline timeline={allPostsData} />
            </ResumeSection>
            <ResumeSection key={1} type="contributions">
                <ReactGitHubCalendar />
            </ResumeSection>
            <ResumeSection key={2} type="experiences">
                {experience.map((data, key) => {
                    return <Post data={data} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection key={3} type="projects">
                {project.map((data, key) => {
                    return <Post data={data} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection key={4} type="activities">
                {activity.map((data, key) => {
                    return <Post data={data} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection key={5} type="educations">
                {education.map((data, key) => {
                    return <Post data={data} key={key} />;
                })}
            </ResumeSection>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData();
    return { props: { allPostsData } };
};
