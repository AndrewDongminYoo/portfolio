import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Resume } from '../../types/profile.types'
import ActivityElement from '../../components/resume/activity'
import ExperienceElement from '../../components/resume/experience'
import EducationElement from '../../components/resume/education'
import ProjectElement from '../../components/resume/project'

export default function Post({
    postData,
    home,
}: {
    postData: Resume,
    home: boolean,
}) {
    let children: JSX.Element = <div />
    if (postData.type === 'education') {
        children = <EducationElement education={postData} key={postData.id} />
    } else if (postData.type === 'experience') {
        children = <ExperienceElement experience={postData} key={postData.id} />
    } else if (postData.type === 'project') {
        children = <ProjectElement project={postData} key={postData.id} />
    } else if (postData.type === 'activity') {
        children = <ActivityElement activity={postData} key={postData.id} />
    }
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
