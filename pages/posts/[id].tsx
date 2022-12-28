import {
    ActivityElement,
    EducationElement,
    ExperienceElement,
    ProjectElement,
} from '@components/resume';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPostIds, getPostData } from '@lib/posts';
import Head from 'next/head';
import Layout from '@components/layout';
import { ReactNode } from 'react';
import { Resume } from '@typings/profile';
import styles from '@styles/resume.module.css';

type SectionType =
    | 'experiences'
    | 'projects'
    | 'educations'
    | 'activities'
    | 'contributions'
    | 'timeline';

const Post = ({ data, sub = true }: { data: Resume; sub?: boolean }) => {
    const children = ((resume: Resume) => {
        switch (resume.type) {
            case 'education':
                return <EducationElement education={resume} />;
            case 'experience':
                return <ExperienceElement experience={resume} />;
            case 'project':
                return <ProjectElement project={resume} />;
            case 'activity':
                return <ActivityElement activity={resume} />;
            default:
                return resume;
        }
    })(data);

    if (sub) {
        return (
            <Layout sub>
                <Head>
                    <title>{data.title}</title>
                </Head>
                <>{children}</>
            </Layout>
        );
    } else {
        return children;
    }
};

export const ResumeSection = ({
    children,
    type,
}: {
    children: ReactNode[] | ReactNode;
    type: SectionType;
}) => {
    return (
        <section className={styles.resume_card}>
            <div className={styles.resume_card_header}>
                <div className={styles.resume_card_left}>
                    <h4 className={styles.resume_card_header_title}>
                        {getSubtitle(type)}
                    </h4>
                </div>
                <div className={styles.resume_card_right}></div>
            </div>
            <div className={styles.resume_card_body}>{children}</div>
        </section>
    );
};

const getSubtitle = (type: SectionType) => {
    switch (type) {
        case 'educations':
            return '학력/전공';
        case 'experiences':
            return '업무 프로젝트';
        case 'projects':
            return '개인/팀 프로젝트';
        case 'activities':
            return '활동/교육';
        case 'contributions':
            return '퍼블릭 컨트리뷰션';
        case 'timeline':
            return '타임라인';
    }
};

export const getStaticPaths: GetStaticPaths = () => {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
    const data = getPostData(params?.id as string);
    return {
        props: {
            data,
        },
    };
};

export default Post;
