import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPostIds, getPostData } from '@lib/posts';
import Head from 'next/head';
import Layout from '@components/layout';
import Post from '@components/resume/post';
import { Resume } from '@typings/profile';

export default function PostPage({ data, sub = true }: { data: Resume; sub?: boolean }) {
    return (
            <Layout sub={sub}>
                <Head>
                    <title>{data.title}</title>
                </Head>
                <Post data={data} />
            </Layout>
    );
};

export const getStaticPaths: GetStaticPaths = () => {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
    const data = getPostData(params?.post as string);
    return {
        props: {
            data,
        },
    };
};