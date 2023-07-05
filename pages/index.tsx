import Resume, { Activity, Education, Experience, Project } from '@/types/profile';
import type { GetStaticProps } from 'next';
import GridTimeline from '@/components/timeline';
import Head from 'next/head';
import Layout from '@/components/layout';
import Post from '@/components/posts';
import ReactGitHubCalendar from '@/components/calendar';
import ResumeSection from '@/components/section';
import { getSortedPostsData } from '@/lib/posts';
import groupBy from 'lodash.groupby';
import isAfter from 'date-fns/isAfter';
import parse from 'date-fns/parseISO';
import { primaryTitle } from '@/constants/';

export default function Home({ allPostsData }: { allPostsData: Resume[] }) {
    allPostsData = allPostsData.filter((resume) =>
        isAfter(parse(resume.startAt), new Date(2022, 1, 1))
    );
    const groupedPosts = groupBy(allPostsData, (resume: Resume) => resume.type);
    const experience = groupedPosts.experience as Experience[];
    const project = groupedPosts.project as Project[];
    const activity = groupedPosts.activity as Activity[];
    const education = groupedPosts.education as Education[];
    return (
        <Layout>
            <Head>
                <meta
                    name='keywords'
                    content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인'
                />
                <title>{primaryTitle}</title>
            </Head>
            <ResumeSection key={`${0}-timeline`} type='timeline'>
                <GridTimeline timeline={allPostsData} />
            </ResumeSection>
            <ResumeSection key={`${1}-contributions`} type='contributions'>
                <ReactGitHubCalendar />
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

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData();
    return { props: { allPostsData } };
};
