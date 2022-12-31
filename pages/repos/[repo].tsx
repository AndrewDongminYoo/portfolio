import { GetStaticPaths, GetStaticProps } from 'next';
import { readData, readReposIds } from '@lib/repos';
import Image from 'next/image';
import LanguageButton from '@components/resume/language';
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
            <Link href={`/repos/${repository.name}`}
                >hellohello</Link>
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
};

export const getStaticPaths: GetStaticPaths = () => {
    const paths = readReposIds();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
    const repository = readData(params?.repo as string);
    return {
        props: {
            repository,
        },
    };
};