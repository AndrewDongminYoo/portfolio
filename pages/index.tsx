import { Activity, Education, Experience, Project, Resume } from '../types/profile.types';
import { ActivityElement, EducationElement, ExperienceElement, ProjectElement } from '../components/resume'
import { GetStaticProps } from 'next';
import GridTimeline from '../components/timeline';
import Head from 'next/head';
import Layout from '../components/layout';
import { ResumeSection } from './posts/[id]';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { getSortedPostsData } from '../lib/posts';

const ReactGitHubCalendar = dynamic(
    () => import('react-ts-github-calendar'),
    { ssr: false }
);

export default function Home({ allPostsData }: { allPostsData: Resume[] }) {
    const groupedPosts = _.groupBy(
        allPostsData,
        (resume: Resume) => resume.type
    );
    const experience = groupedPosts.experience as Experience[];
    const project = groupedPosts.project as Project[];
    const activity = groupedPosts.activity as Activity[];
    const education = groupedPosts.education as Education[];

    return (
        <Layout home>
            <Head>
                <meta name="keywords" content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인' />
            </Head>
            <ResumeSection type="timeline">
                <GridTimeline timeline={allPostsData} />
            </ResumeSection>
            <ResumeSection type="contributions">
                <ReactGitHubCalendar
                    userName="AndrewDongminYoo"
                    responsive
                />
            </ResumeSection>
            <ResumeSection type="experiences">
                {experience.map((data, key) => {
                    return <ExperienceElement experience={data} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection type="projects">
                {project.map((data, key) => {
                    return <ProjectElement project={data} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection type="activities">
                {activity.map((data, key) => {
                    return <ActivityElement activity={data} key={key} />;
                })}
            </ResumeSection>
            <ResumeSection type="educations">
                {education.map((data, key) => {
                    return <EducationElement education={data} key={key} />;
                })}
            </ResumeSection>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
};
