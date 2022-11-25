import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'
import GridTimeline from '../components/timeline'
import StackList from '../components/stacks'

export default function Home({
    allPostsData
}: {
    allPostsData: {
        date: string
        title: string
        id: string
    }[]
}) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <StackList />
            <div className={utilStyles.resume_detail}>
                <GridTimeline />
                {allPostsData.map(({ id, date, title }) => (
                    <li className={utilStyles.listItem} key={id}>
                        <Link href={`/posts/${id}`}>{title}</Link>
                        <br />
                        <small className={utilStyles.lightText}>
                            <Date dateString={date} />
                        </small>
                    </li>
                ))}
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
