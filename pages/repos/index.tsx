import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@components/layout';
import React from 'react';
import ReactGitHubCalendar from '@components/calendar';
import Repo from '@pages/repos/[repo]';
import { Repository } from '@typings/repos';
import ResumeSection from '@components/section';
import { readRepositories } from '@lib/repos';
import { secondaryTitle } from '@data/constants';

export default function Portfolio({
    repositoryData,
}: {
    repositoryData: Repository[];
}) {
    return (
        <Layout>
            <Head>
                <meta
                    name="keywords"
                    content="서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인"
                />
                <title>{secondaryTitle}</title>
            </Head>
            {repositoryData.map((repo, id) => {
                return <Repo repository={repo} key={id} />;
            })}
            <ResumeSection type="contributions">
                <ReactGitHubCalendar />
            </ResumeSection>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = () => {
    const repositoryData = readRepositories();
    return { props: { repositoryData } };
};
