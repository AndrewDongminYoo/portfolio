import React, { Component, ComponentProps, createRef } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout';
import ReactGitHubCalendar from '@/components/calendar';
import Repo from '@/pages/repos/[repo]';
import type Repository from '@/types/repos';
import ResumeSection from '@/components/section';
import { readRepositories } from '@/lib/repos';
import { secondaryTitle } from '@/constants/';

type PortfolioProps = ComponentProps<'div'> & {
    repositoryData: Repository[];
};

class Portfolio extends Component<PortfolioProps> {
    sectionRef = createRef<HTMLElement>();

    componentDidMount() {
        if (this.sectionRef.current) {
            this.sectionRef.current.firstElementChild?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }
    render() {
        const { repositoryData } = this.props;

        return (
            <Layout>
                <Head>
                    <meta
                        name='keywords'
                        content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인'
                    />
                    <title>{secondaryTitle}</title>
                </Head>
                <section
                    aria-label='repositories'
                    ref={this.sectionRef}
                    className='w-full p-6 mx-0 my-6 border border-gray-300 border-solid rounded-lg'>
                    {repositoryData.map((repo, id) => {
                        return <Repo repository={repo} key={`${id}-${repo.node_id}`} />;
                    })}
                </section>
                <ResumeSection type='contributions'>
                    <ReactGitHubCalendar />
                </ResumeSection>
            </Layout>
        );
    }
}

export const getStaticProps: GetStaticProps = () => {
    const repositoryData = readRepositories();
    return { props: { repositoryData } };
};

export default Portfolio;
