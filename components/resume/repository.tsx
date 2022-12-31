import Image from 'next/image';
import Link from 'next/link';
import { Repository } from '@typings/repos';
import colorMap from '@data/lang_colors.module.json';

type T = keyof typeof colorMap;

export default function Repo({ repository }: { repository: Repository }) {
    const { meta_tags, name, html_url, languages } = repository;
    const languageIter = Object.entries(languages);
    const totalCount = languageIter.reduce((pre, cur) => pre + cur[1], 0);
    return (
        <div>
            <Link aria-label={meta_tags?.title ?? name} href={html_url}>
                <Image
                    alt={meta_tags?.['image:alt'] || name}
                    src={meta_tags?.image as string}
                    width={540}
                    height={270}
                    style={{ aspectRatio: 'auto 997 / 498', display: 'block' }}
                    priority={true}
                />
            </Link>
            <ul
                style={{
                    listStyle: 'none',
                    padding: '0 0 0 0',
                }}
            >
                {languageIter.map(([lang, count], id) => {
                    return (
                        <LanguageButton
                            language={lang as T}
                            percent={(count / totalCount) * 100}
                            key={id}
                            index={id}
                        />
                    );
                })}
            </ul>
        </div>
    );
}

const LanguageButton = ({
    language,
    percent,
    index,
}: {
    language: T;
    percent: number;
    index: number;
}) => {
    const backgroundColor = colorMap[language] as string;
    const myRepoLanguage = `https://github.com/AndrewDongminYoo?tab=repositories&language=${language}`;
    const trendingOfLang = `https://github.com/topics/${language}`;

    return (
        <li
            style={{
                display: 'inline-flex !important',
                alignItems: 'center',
                marginRight: '4px',
            }}
        >
            <Link href={index === 0 ? myRepoLanguage : trendingOfLang}>
                <span
                    style={{
                        backgroundColor,
                        display: 'inline-block',
                        width: '13px',
                        height: '13px',
                        borderRadius: '50%',
                        marginRight: '4px',
                    }}
                    aria-hidden="true"
                />
                <span
                    style={{
                        fontWeight: '600',
                        marginRight: '4px',
                        color: '#24292f',
                    }}
                >
                    {language}
                </span>
                <span>{percent.toFixed(1) + '%'}</span>
            </Link>
        </li>
    );
};
