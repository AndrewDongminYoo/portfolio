'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import LanguageButton from '@/features/repos/lang_btn';
import LanguageStateBar from '@/features/repos/langs_bar';
import RepoCard from '@/features/repos/repo_card';
import { LanguageMeta, LanguageType } from '@/interface/language';
import type Repository from '@/interface/repos';

import languagesData from '../../../public/languages.json';

const languagesMeta = languagesData as Record<string, LanguageMeta>;

function isProgrammingLanguage(language: string): boolean {
  return languagesMeta[language]?.type === ('programming' satisfies LanguageType);
}

interface RepoProps {
  repository: Repository;
}

export default function RepoContent({ repository }: RepoProps) {
  const { full_name, html_url, languages } = repository;

  const { programmingLanguages, total } = useMemo(() => {
    const entries = Object.entries(languages ?? {});
    const programmingLanguages = entries.filter(([lang]) => isProgrammingLanguage(lang));
    const total = programmingLanguages.reduce(
      (sum, [, count]) => sum + (typeof count === 'number' ? count : 0),
      0,
    );
    return { programmingLanguages, total };
  }, [languages]);

  return (
    <article aria-label='repositories'>
      <Link
        href={html_url}
        className='box-border text-sm leading-tight font-medium wrap-break-word text-slate-300'>
        {full_name}
      </Link>

      <RepoCard repository={repository} />

      {programmingLanguages.length > 0 && total > 0 ? (
        <>
          <LanguageStateBar languages={programmingLanguages} totalCount={total} />
          <ul className='mt-0 list-none px-0 py-0'>
            {programmingLanguages.map(([lang, count], index) => (
              <LanguageButton
                key={lang}
                language={lang}
                percent={(count / total) * 100}
                index={index}
              />
            ))}
          </ul>
        </>
      ) : null}
    </article>
  );
}
