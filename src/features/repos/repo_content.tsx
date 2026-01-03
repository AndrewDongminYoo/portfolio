'use client';

import Link from 'next/link';

import LanguageButton from '@/features/repos/lang_btn';
import LanguageStateBar from '@/features/repos/langs_bar';
import RepoCard from '@/features/repos/repo_card';
import { LanguageMeta } from '@/interface/language';
import type Repository from '@/interface/repos';

import languagesData from '../../../public/languages.json';

const languagesMeta = languagesData as Record<string, LanguageMeta>;
const isProgrammingLanguage = (language: string) => languagesMeta[language]?.type === 'programming';

interface RepoProps {
  repository: Repository;
}

export default function RepoContent({ repository }: RepoProps) {
  const { full_name, html_url, languages } = repository;
  const includeStatic = Object.entries(languages);
  const excludeStatic = includeStatic.filter(([lang]) => isProgrammingLanguage(lang));
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
