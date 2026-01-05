import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import RepoList from '@/features/repos/repo-list';
import { readRepositories } from '@/lib/repos/fs-store';

export default async function Portfolio() {
  const repositoryData = readRepositories();
  return (
    <Layout>
      <RepoList repositories={repositoryData} />
      <ReactGithubCalendar />
    </Layout>
  );
}
