import React, { createRef, useLayoutEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from 'components/layout';
import ReactGithubCalendar from 'components/calendar';
import Repo from 'pages/repos/[repo]';
import type Repository from 'types/repos';
import { readRepositories } from 'lib/repos';
import { secondaryTitle } from '@/constants/';

type PortfolioProps = {
    repositoryData: Repository[];
};

export default function Portfolio({ repositoryData }: PortfolioProps) {
    const sectionRef = createRef<HTMLElement>();
    useLayoutEffect(() => {
        if (sectionRef.current) {
            sectionRef.current.firstElementChild?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [sectionRef]);

    return (
        <Layout title={secondaryTitle}>
            <section
                aria-label='repositories'
                ref={sectionRef}
                className='w-full p-6 mx-0 my-6 border border-gray-300 border-solid rounded-lg'>
                {repositoryData.map((repo, id) => {
                    return <Repo repository={repo} key={`${id}-${repo.node_id}`} />;
                })}
            </section>
            <ReactGithubCalendar />
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = () => {
    const repositoryData = readRepositories();
    return { props: { repositoryData } };
};
