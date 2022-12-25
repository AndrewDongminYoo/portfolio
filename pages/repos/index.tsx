import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@components/layout';
import Repo from '@pages/repos/[id]';
import { Repository } from '@typings/repos';
import { ResumeSection } from '@pages/posts/[id]';
import dynamic from 'next/dynamic';
import { getTagsFromRepository } from '@lib/repos';

const ReactGitHubCalendar = dynamic(
    () => import('react-ts-github-calendar'),
    { ssr: false }
);

const Portfolio = ({ repositoryData }: { repositoryData: Repository[]; }) => {
    const sub = false;
    return (
        <Layout sub={sub} >
            <Head>
                <meta name="keywords" content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인' />
            </Head>
            {Object.entries(repositoryData).map(([id, repo]) => <Repo repository={repo} key={id} />)}
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
    const repository = await getTagsFromRepository()
    const repositoryData = repository.filter((repo) => repo.visibility === 'public' && repo.folk !== true)
    return {
        props: {
            repositoryData
        },
    };
};

export default Portfolio;