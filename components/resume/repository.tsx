import Image from 'next/image';
import Link from 'next/link';
import { Repository } from '@typings/repos';
import colorMap from '@data/lang_colors.module.json';

type language = keyof typeof colorMap;

const Repo = ({ repository }: { repository: Repository; }) => {
    const languages = Object.entries(repository?.languages)
    const totalCount = Object
        .values(repository?.languages)
        .reduce((pre, cur) => pre + cur, 0)
    return (
        <div>
            <Link
                aria-label={repository.meta_tags?.title ?? repository.name}
                href={repository.html_url}
            >
                <Image
                    alt={repository.meta_tags?.['image:alt'] || repository.name}
                    src={repository.meta_tags?.image as string}
                    width={540}
                    height={270}
                    style={{ aspectRatio: 'auto 997 / 498', display: 'block' }}
                    priority={true}
                />
                <ul style={{
                    listStyle: 'none',
                    padding: "0 0 0 0",
                }}>
                    {languages.map(([lang, count], i) => {
                        return <LanguageButton lang={lang as language} per={(count / totalCount) * 100} key={i} />;
                    })}
                </ul>
            </Link>
        </div>
    );
};

const LanguageButton = ({ lang, per }: { lang: string; per: number; }) => {
    const backgroundColor = Object.keys(colorMap).includes(lang) ? colorMap[lang as language] : undefined;
    // if (!backgroundColor) return null;
    return (
        <li style={{
            display: 'inline-flex !important',
            alignItems: 'center',
            marginRight: '4px'
        }}>
            <span style={{
                backgroundColor,
                display: 'inline-block',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                marginRight: '4px'
            }} aria-hidden="true" />
            <span style={{
                fontWeight: '600',
                marginRight: '4px',
                color: '#24292f',
            }}>{lang}</span>
            <span>{per.toFixed(1) + "%"}</span>
        </li>
    );
}

export default Repo;
