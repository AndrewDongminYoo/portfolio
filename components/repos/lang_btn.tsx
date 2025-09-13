import Link from 'next/link';

import Language, { colorMap } from './lang_colors';

export default function LanguageButton({
  language,
  percent,
  index,
}: {
  language: Language;
  percent: number;
  index: number;
}) {
  const backgroundColor = colorMap[language] as string;
  const myRepoLanguage = `https://github.com/AndrewDongminYoo?tab=repositories&language=${language}`;
  const trendingOfLang = `https://github.com/topics/${language}`;
  const style = { backgroundColor };
  return (
    <li className='mt-1 mr-3 inline-flex items-center'>
      <Link href={index === 0 ? myRepoLanguage : trendingOfLang}>
        <span className='mr-1 inline-block h-3 w-3 rounded-full' style={style} aria-hidden={true} />
        <span className='text-foreground mr-1 font-medium'>{language}</span>
        <span>{percent.toFixed(1) + '%'}</span>
      </Link>
    </li>
  );
}
