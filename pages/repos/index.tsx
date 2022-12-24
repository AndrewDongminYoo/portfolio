import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/layout';
import Repo from './[id]';
import { Repository } from '../../types/repos.types';
import { ResumeSection } from './../posts/[id]';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { facebookApiOnload } from '../../lib/facebook';
import { getReposLanguages } from '../../lib/repos';
import { useState } from 'react';

const ReactGitHubCalendar = dynamic(
    () => import('react-ts-github-calendar'),
    { ssr: false }
);

const Portfolio = ({ repositoryData }: { repositoryData: Repository[]; }) => {
    const [repository, setRepository] = useState(repositoryData);
    const [ready, setReady] = useState(false)
    const sub = false;
    return (
        <Layout sub={sub} >
            <Head>
                <meta name="keywords" content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인' />
            </Head>
            <Script
                src="https://connect.facebook.net/en_US/sdk.js"
                strategy="lazyOnload"
                onLoad={async () => {
                    await facebookApiOnload(repositoryData)
                        .then(setRepository).then(() => setReady(true));
                }}
            />
            {ready && Object.entries(repository).map(([id, repo]) => <Repo repository={repo} key={id} />)}
            <ResumeSection key={1} type="contributions">
                <ReactGitHubCalendar
                    userName="AndrewDongminYoo"
                    responsive
                />
            </ResumeSection>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const repositoryData = await getReposLanguages()
    return {
        props: {
            repositoryData,
        },
    };
};


export default Portfolio;