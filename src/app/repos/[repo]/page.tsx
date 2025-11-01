import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';

import RepoCard from '@/features/repos/card';
import LanguageButton from '@/features/repos/lang_btn';
import type Language from '@/features/repos/lang_colors';
import LanguageStateBar from '@/features/repos/langs_bar';
import type Repository from '@/interface/repos';
import { readData, readReposIds } from '@/lib/repos';

type RepoProps = {
  repository: Repository;
};

export default function Repo({ repository }: RepoProps) {
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

export const getStaticPaths: GetStaticPaths = () => {
  const paths = readReposIds();
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  const repository = readData(params?.repo as string);
  return { props: { repository } };
};
