'use client';

import { getSimpleIcon } from './simple_icons';

export default function LanguageStateBar({
  languages,
  totalCount,
}: {
  languages: [string, number][];
  totalCount: number;
}) {
  return (
    <span
      data-view-component={true}
      className='mt-1 flex h-3 border-collapse overflow-hidden bg-transparent'>
      {languages.map(([language, count], id) => {
        return (
          <LanguageBarPart
            language={language}
            percent={(count / totalCount) * 100}
            key={`${id}-${language}-${count}`}
          />
        );
      })}
    </span>
  );
}

function LanguageBarPart({ language, percent }: { language: string; percent: number }) {
  const backgroundColor = getSimpleIcon(language)?.color ?? '#999999';
  const width = percent.toFixed(1) + '%';
  return (
    <span
      itemProp='keywords'
      aria-label={`${language} ${percent.toFixed(3)}`}
      data-view-component={true}
      className='ml-0.5 flex h-3 border-collapse overflow-hidden first:ml-0'
      style={{
        backgroundColor,
        width,
      }}
    />
  );
}
