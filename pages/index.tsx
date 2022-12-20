import { Activity, Education, Experience, Project, Resume } from '../types/profile.types';
import { ActivityElement, EducationElement, ExperienceElement, ProjectElement } from '../components/resume'
import Layout, { siteTitle } from '../components/layout';
import { GetStaticProps } from 'next';
import GridTimeline from '../components/timeline';
import Head from 'next/head';
import { ResumeSection } from './posts/[id]';
import StackList from '../components/stacks';
import _ from 'lodash';
import { getSortedPostsData } from '../lib/posts';
import utilStyles from '../styles/utils.module.css';

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
                <title>{siteTitle}</title>
            </Head>
            <StackList />
            <div className={utilStyles.resume_detail}>
                <GridTimeline />
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
            </div>
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
