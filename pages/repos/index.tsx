import { useEffect, useRef } from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@components/layout';
import ReactGitHubCalendar from '@components/calendar';
import Repo from '@pages/repos/[repo]';
import type { Repository } from '@typings/repos';
import ResumeSection from '@components/section';
import { readRepositories } from '@lib/repos';
import { secondaryTitle } from '@constants';

export default function Portfolio({
    repositoryData,
}: {
    repositoryData: Repository[];
}) {
    const sectionRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (sectionRef) {
            // 홈스크린과 프로필 부분이 같으니까 스킵하기
            sectionRef.current?.firstElementChild?.scrollIntoView({
                behavior: "smooth", block: "start"
            });
        }
    }, [sectionRef])

    return (
        <Layout>
            <Head>
                <meta
                    name="keywords"
                    content="서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인"
                />
                <title>{secondaryTitle}</title>
            </Head>
            <section
                ref={sectionRef}
                className="w-full p-6 mx-0 my-6 border border-gray-300 border-solid rounded-lg">
                {repositoryData.map((repo, id) => {
                    return <Repo repository={repo} key={id} />;
                })}
            </section>
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
