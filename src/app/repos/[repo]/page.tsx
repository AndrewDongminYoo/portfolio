import { notFound } from 'next/navigation';

import RepoContent from '@/features/repos/repo_content';
import { readData } from '@/lib/repos';

interface RepoPageProps {
  params: Promise<{
    repo: string;
  }>;
}

export default async function RepoDetailPage(props: RepoPageProps) {
  const { repo } = await props.params;
  const repository = readData(repo);

  if (!repository) {
    return notFound();
  }

  return <RepoContent repository={repository} />;
}
