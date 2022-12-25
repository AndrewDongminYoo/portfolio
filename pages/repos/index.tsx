import { OpenGraph, Repository } from '@typings/repos';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@components/layout';
import Repo from '@pages/repos/[id]';
import { ResumeSection } from '@pages/posts/[id]';
import dynamic from 'next/dynamic';
import { getRepositories } from '@lib/repos';
import { getTagsFromWebsite } from '@lib/metatag';

const ReactGitHubCalendar = dynamic(
    () => import('react-ts-github-calendar'),
    { ssr: false }
);

const Portfolio = ({ repositoryData, metaTagsData }: { repositoryData: Repository[]; metaTagsData: OpenGraph[] }) => {
    const sub = false;
    return (
        <Layout sub={sub} >
            <Head>
                <meta name="keywords" content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인' />
            </Head>
            {repositoryData
                .map((repo, id) => {
                    const meta = metaTagsData
                        .find((og) => og.url === repo.html_url) as OpenGraph;
                    return (
                        <Repo repository={repo} metaTags={meta} key={id} />
                    )
                })}
            <ResumeSection type="contributions">
                <ReactGitHubCalendar
                    userName="AndrewDongminYoo"
                    responsive
                />
            </ResumeSection>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const repository = await getRepositories()
    const repositoryData = repository.filter((repo) => repo.visibility === 'public' && repo.folk !== true)
    const metaTagsData = await Promise.all(repository.map(async (repo) => await getTagsFromWebsite(repo.html_url)))
    return {
        props: {
            repositoryData,
            metaTagsData
        },
    };
};

export default Portfolio;