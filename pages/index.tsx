import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import { GetStaticProps } from 'next';
import GridTimeline from '../components/timeline';
import StackList from '../components/stacks';
import {
    Activity,
    Education,
    Experience,
    Project,
    Resume,
} from '../types/profile.types';
import _ from 'lodash';
import ActivityElement from '../components/resume/activity';
import EducationElement from '../components/resume/education';
import ExperienceElement from '../components/resume/experience';
import ProjectElement from '../components/resume/project';
import { ResumeSection } from './posts/[id]';

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
