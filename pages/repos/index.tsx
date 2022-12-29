import { OpenGraph, Repository } from '@typings/repos';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@components/layout';
import ReactGitHubCalendar from '@components/calendar';
import Repo from '@pages/repos/[id]';
import { ResumeSection } from '@pages/posts/[id]';
import { getRepositories } from '@lib/repos';
import { getTagsFromWebsite } from '@lib/metatag';

const Portfolio = ({
    repositoryData,
    metaTagsData,
}: {
    repositoryData: Repository[];
    metaTagsData: OpenGraph[];
}) => {
    const sub = false;
    return (
        <Layout sub={sub}>
            <Head>
                <meta
                    name="keywords"
                    content="서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인"
                />
            </Head>
            {repositoryData.map((repo, id) => {
                const meta = metaTagsData.find(
                    (og) => og.url === repo.html_url
                ) as OpenGraph;
                return <Repo repository={repo} metaTags={meta} key={id} />;
            })}
            <ResumeSection type="contributions">
                <ReactGitHubCalendar />
            </ResumeSection>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const repositoryData = getRepositories();
    const metaTagsData = await Promise.all(
        repositoryData.map(async (repo) => await getTagsFromWebsite(repo.html_url))
    );
    return {
        props: {
            repositoryData,
            metaTagsData,
        },
    };
};

export default Portfolio;
