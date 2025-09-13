import { GetStaticProps } from 'next';
import React, { createRef, useEffect } from 'react';

import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import { secondaryTitle } from '@/constants/';
import { readRepositories } from '@/lib/repos';
import Repo from '@/pages/repos/[repo]';
import type Repository from '@/types/repos';

type PortfolioProps = {
  repositoryData: Repository[];
};

export default function Portfolio({ repositoryData }: PortfolioProps) {
  const sectionRef = createRef<HTMLElement>();
  useEffect(() => {
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
        className='mx-0 my-6 w-full rounded-lg border border-solid border-gray-300 px-6 py-6'>
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
