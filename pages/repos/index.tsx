import Head from 'next/head';
import Layout from '@components/layout';
import React from 'react';
import ReactGitHubCalendar from '@components/calendar';
import Repo from '@components/resume/repository';
import { Repository } from '@typings/repos';
import { ResumeSection } from '@pages/posts/[id]';
import { selfAPIAxios } from '@pages/fetcher';

export default function Portfolio({
    repositoryData,
}: {
    repositoryData: Repository[];
}) {
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
                return <Repo repository={repo} key={id} />;
            })}
            <ResumeSection type="contributions">
                <ReactGitHubCalendar />
            </ResumeSection>
        </Layout>
    );
}

Portfolio.getInitialProps = async () => {
    const repositories = (
        await selfAPIAxios.get('/api/repos').then((res) => res.data)
    ).repositories as Repository[];
    const repositoryData = await Promise.all(
        repositories.map(async (repo) => {
            const { meta_tags, languages } = await selfAPIAxios
                .get(`/api/langs?full_name=${repo.full_name}`)
                .then((res) => res.data);
            return { ...repo, meta_tags, languages };
        })
    );
    return { repositoryData };
};
