'use client';

import Link from 'next/link';

import { getSimpleIcon } from './simple_icons';

export default function LanguageButton({
  language,
  percent,
  index,
}: {
  language: string;
  percent: number;
  index: number;
}) {
  const icon = getSimpleIcon(language);
  const backgroundColor = icon?.color ?? '#999999';

  const myRepoLanguage = `https://github.com/AndrewDongminYoo?tab=repositories&language=${language}`;
  const trendingOfLang = `https://github.com/topics/${language}`;

  return (
    <li className='mt-1 mr-3 inline-flex items-center'>
      <Link href={index === 0 ? myRepoLanguage : trendingOfLang}>
        <span
          className='mr-1 inline-block h-3 w-3 rounded-full'
          style={{ backgroundColor }}
          aria-hidden={true}
        />
        <span className='text-foreground mr-1 font-medium'>{language}</span>
        <span>{percent.toFixed(1) + '%'}</span>
      </Link>
    </li>
  );
}
