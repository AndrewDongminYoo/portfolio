import { Activity, Education, Experience, Project, Resume } from '@typings/profile';
import Post, { ResumeSection } from '@pages/posts/[id]';
import { GetStaticProps } from 'next';
import GridTimeline from '@components/timeline';
import Head from 'next/head';
import Layout from '@components/layout';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { getSortedPostsData } from '@lib/posts';
import useSwr from 'swr';

const ReactGitHubCalendar = dynamic(
    () => import('react-ts-github-calendar'),
    { ssr: false }
);

const Home = ({ allPostsData }: { allPostsData: Resume[] }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json())
    const { data, error, isValidating, isLoading } = useSwr('/api/hello', fetcher)
    if (isLoading || isValidating) {
        return null;
    }
    data && console.log("data:", data)
    error && console.log("error:", error)
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
        <Layout sub={sub} >
            <Head>
                <meta name="keywords" content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인' />
            </Head>
            <ResumeSection key={0} type="timeline">
                <GridTimeline timeline={allPostsData} />
            </ResumeSection>
            <ResumeSection key={1} type="contributions">
                <ReactGitHubCalendar
                    userName="AndrewDongminYoo"
                    responsive
                />
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
}

export const getStaticProps: GetStaticProps = () => {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
};

export default Home;