import { ActivityElement, EducationElement, ExperienceElement, ProjectElement } from '../../components/resume'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Layout from '../../components/layout'
import { ReactNode } from 'react'
import { Resume } from '../../types/profile.types'
import styles from '../../styles/resume.module.css'

type SectionType = "experiences" | "projects" | "educations" | "activities" | "contributions" | "timeline";

export default function Post({
    postData,
    home,
    key,
}: {
    postData: Resume;
    home: boolean;
    key: number;
}) {
    const getElement = (resume: Resume) => {
        switch (resume.type) {
            case 'education': {
                return <EducationElement education={resume} key={key} />
            } case 'experience': {
                return <ExperienceElement experience={resume} key={key} />
            } case 'project': {
                return <ProjectElement project={resume} key={key} />
            } case 'activity': {
                return <ActivityElement activity={resume} key={key} />
            }
        }
    }
    const children: JSX.Element = getElement(postData)

    if (home) {
        return children
    } else {
        return (
            <Layout>
                <Head>
                    <title>{postData.title}</title>
                </Head>
                <article>
                    {children}
                </article>
            </Layout>
        )
    }
}

export const ResumeSection = (
    { children, type }: {
        children: ReactNode[] | ReactNode;
        type: SectionType;
    }) => {
    return (
        <section className={styles.resume_card}>
            <div className={styles.resume_card_header}>
                <div className={styles.resume_card_left}>
                    <h4 className={styles.resume_card_header_title}>
                        {getSectionTitle(type)}
                    </h4>
                </div>
                <div className={styles.resume_card_right}>
                </div>
            </div>
            <div className={styles.resume_card_body}>
                {children}
            </div>
            <div className={styles.resume_card_footer}>
            </div>
        </section>
    )
}

const getSectionTitle = (type: SectionType) => {
    switch (type) {
        case 'educations': return '학력/전공';
        case 'experiences': return '업무 프로젝트';
        case 'projects': return '개인/팀 프로젝트';
        case 'activities': return '활동/교육';
        case 'contributions': return '깃헙 컨트리뷰션';
        case 'timeline': return "타임라인";
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params?.id as string)
    return {
        props: {
            postData
        }
    }
}
