import Link from 'next/link';
import { notFound } from 'next/navigation';

import LanguageButton from '@/features/repos/lang_btn';
import type Language from '@/features/repos/lang_colors';
import LanguageStateBar from '@/features/repos/langs_bar';
import RepoCard from '@/features/repos/repo_card';
import type Repository from '@/interface/repos';
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

interface RepoProps {
  repository: Repository;
}

export function RepoContent({ repository }: RepoProps) {
  const { full_name, html_url, languages } = repository;
  const includeStatic = Object.entries(languages);
  const excludeStatic = includeStatic.filter(([lang]) => lang !== 'HTML' && lang !== 'CSS') as [
    Language,
    number,
  ][];
  const totalCount = excludeStatic.reduce((pre, cur) => pre + cur[1], 0);

  return (
    <article aria-label='repositories'>
      <Link
        href={html_url}
        className='box-border text-sm leading-tight font-medium wrap-break-word text-slate-300'>
        {full_name}
      </Link>
      <RepoCard repository={repository} />
      <LanguageStateBar languages={excludeStatic} totalCount={totalCount} />
      <ul className='mt-0 list-none px-0 py-0'>
        {excludeStatic.map(([lang, count], id) => {
          return (
            <LanguageButton
              language={lang}
              percent={(count / totalCount) * 100}
              key={`${id}-${lang}-${count}`}
              index={id}
            />
          );
        })}
      </ul>
    </article>
  );
}
