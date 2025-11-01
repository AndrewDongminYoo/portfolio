import Link from 'next/link';

import { RepoContent } from '@/app/repos/[repo]/page';
import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import { readRepositories } from '@/lib/repos';

export default async function Portfolio() {
  const repositoryData = readRepositories();
  return (
    <Layout>
      <section
        aria-label='repositories'
        className='mx-0 my-6 w-full rounded-lg border border-solid border-gray-300 px-6 py-6'>
        {repositoryData.map((repo, id) => {
          return <RepoContent repository={repo} key={`${id}-${repo.node_id}`} />;
        })}
      </section>
      <ReactGithubCalendar />
      <Link href='/' className='leading-8 font-extrabold'>
        🔙 {'홈으로가기'}
      </Link>
    </Layout>
  );
}
