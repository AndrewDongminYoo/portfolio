import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Resume } from '../../types/profile.types'
import ActivityElement from '../../components/resume/activity'
import ExperienceElement from '../../components/resume/experience'
import EducationElement from '../../components/resume/education'
import ProjectElement from '../../components/resume/project'
import { ReactNode } from 'react'
import styles from '../../styles/resume.module.css'


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
        type: "experiences" | "projects" | "educations" | "activities"
    }) => {
    let title: string;
    switch (type) {
        case 'educations': title = '활동/교육'; break;
        case 'experiences': title = '업무 프로젝트'; break;
        case 'projects': title = '개인/팀 프로젝트'; break;
        case 'activities': title = '활동/교육'; break;
    }
    return (
        <section className={styles.resume_card}>
            <div className={styles.resume_card_header}>
                <div className={styles.resume_card_left}>
                    <h4 className={styles.resume_card_header_title}>
                        {title}
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
