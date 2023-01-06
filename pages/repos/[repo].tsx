import type { GetStaticPaths, GetStaticProps } from 'next';
import { readData, readReposIds } from '@lib/repos';
import Image from 'next/image';
import type { Language } from '@components/repos/lang_colors';
import LanguageButton from '@components/repos/lang_btn';
import LanguageStateBar from '@components/repos/langs_bar';
import Link from 'next/link';
import type { Repository } from '@typings/repos';
import names from 'classnames';

export default function Repo({ repository }: { repository: Repository }) {
    const { meta_tags, name, html_url, languages } = repository;
    const languageIter = Object.entries(languages) as [Language, number][];
    const totalCount = languageIter.reduce((pre, cur) => pre + cur[1], 0);
    return (
        <div>
            <Link
                href={`/repos/${repository.name}`}
                className={names("box-border font-medium leading-tight text-periwinkle text-sm break-words",)}
            >
                링크를 클릭하면 리포지토리로 이동합니다.
            </Link>
            <Link aria-label={meta_tags?.title ?? name} href={html_url}>
                <Image
                    alt={meta_tags?.title || name}
                    src={meta_tags?.image as string}
                    className={names("block",)}
                    width={540}
                    height={270}
                    priority={true}
                />
            </Link>
            <LanguageStateBar
                languages={languageIter}
                totalCount={totalCount}
            />
            <ul className={names("mt-0 p-0 list-none",)}>
                {languageIter.map(([lang, count], id) => {
                    return (
                        <LanguageButton
                            language={lang}
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

export const getStaticPaths: GetStaticPaths = () => {
    const paths = readReposIds();
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
    const repository = readData(params?.repo as string);
    return { props: { repository } };
};
