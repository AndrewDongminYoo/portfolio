import Link from 'next/link';
import { createRef, useEffect } from 'react';

import Repo from '@/app/repos/[repo]/page';
import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import { readRepositories } from '@/lib/repos';

export default function Portfolio() {
  const repositoryData = readRepositories();
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
    <Layout>
      <section
        aria-label='repositories'
        ref={sectionRef}
        className='mx-0 my-6 w-full rounded-lg border border-solid border-gray-300 px-6 py-6'>
        {repositoryData.map((repo, id) => {
          return <Repo repository={repo} key={`${id}-${repo.node_id}`} />;
        })}
      </section>
      <ReactGithubCalendar />
      <Link href='/' className='leading-8 font-extrabold'>
        🔙 {'홈으로가기'}
      </Link>
    </Layout>
  );
}
