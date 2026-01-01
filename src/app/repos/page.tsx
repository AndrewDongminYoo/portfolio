import Link from 'next/link';

import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import RepoList from '@/features/repos/repo_list';
import { readRepositories } from '@/lib/repos';

export default async function Portfolio() {
  const repositoryData = readRepositories();
  return (
    <Layout>
      <RepoList repositories={repositoryData} />
      <ReactGithubCalendar />
      <Link href='/' className='leading-8 font-extrabold'>
        🔙 {'홈으로가기'}
      </Link>
    </Layout>
  );
}
