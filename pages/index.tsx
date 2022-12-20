import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { GetStaticProps } from 'next'
import GridTimeline from '../components/timeline'
import StackList from '../components/stacks'
import { Resume } from '../types/profile.types'
import Post from './posts/[id]'

export default function Home({
    allPostsData
}: {
    allPostsData: Resume[]
}) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <StackList />
            <div className={utilStyles.resume_detail}>
                <GridTimeline />
                {allPostsData.map((data: Resume, i: number) => {
                    return (
                        <Post postData={data} home={true} key={i} />
                    )
                })}
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData()
    return {
        props: {
            allPostsData
        }
    }
}
