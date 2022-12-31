import Link from 'next/link';
import colorMap from '@data/lang_colors.module.json';

type T = keyof typeof colorMap;

export default function LanguageButton({
    language,
    percent,
    index,
}: {
    language: T;
    percent: number;
    index: number;
}) {
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
