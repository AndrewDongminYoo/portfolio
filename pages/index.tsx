import { Activity, Education, Experience, Project, Resume } from '@typings/profile';
import Post, { ResumeSection } from '@pages/posts/[id]';
import { GetStaticProps } from 'next';
import GridTimeline from '@components/timeline';
import Head from 'next/head';
import Layout from '@components/layout';
import ReactGitHubCalendar from '@components/calendar';
import _ from 'lodash';
import { getSortedPostsData } from '@lib/posts';

const Home = ({ allPostsData }: { allPostsData: Resume[] }) => {
    const groupedPosts = _.groupBy(
        allPostsData,
        (resume: Resume) => resume.type
    );
    const experience = groupedPosts.experience as Experience[];
    const project = groupedPosts.project as Project[];
    const activity = groupedPosts.activity as Activity[];
    const education = groupedPosts.education as Education[];
    const sub = false;
    return (
        <Layout sub={sub}>
            <Head>
                <meta name="keywords" content="서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인" />
            </Head>
            <ResumeSection key={0} type="timeline">
                <GridTimeline timeline={allPostsData} />
            </ResumeSection>
            <ResumeSection key={1} type="contributions">
                <ReactGitHubCalendar />
            </ResumeSection>
            <ResumeSection key={2} type="experiences">
                {experience.map((data, key) => {
                    return <Post data={data} sub={sub} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection key={3} type="projects">
                {project.map((data, key) => {
                    return <Post data={data} sub={sub} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection key={4} type="activities">
                {activity.map((data, key) => {
                    return <Post data={data} sub={sub} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection key={5} type="educations">
                {education.map((data, key) => {
                    return <Post data={data} sub={sub} key={key} />;
                })}
            </ResumeSection>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
};

export default Home;
