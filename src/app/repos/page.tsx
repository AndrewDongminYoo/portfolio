import ReactGithubCalendar from '@/components/calendar';
import Layout from '@/components/layout';
import RepoList from '@/features/repos/repo-list';
import { readRepositories } from '@/lib/repos/fs-store';

export default async function Portfolio() {
  const repositories = readRepositories().filter((r) => !r.private && !!r.description);
  return (
    <Layout>
      <RepoList repositories={repositories} />
      <ReactGithubCalendar />
    </Layout>
  );
}
