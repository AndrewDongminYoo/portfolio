import type { GetStaticPaths, GetStaticProps } from 'next';
import { readData, readReposIds } from '@lib/repos';
import type { Language } from '@components/repos/lang_colors';
import LanguageButton from '@components/repos/lang_btn';
import LanguageStateBar from '@components/repos/langs_bar';
import Link from 'next/link';
import RepoCard from '@components/repos/card';
import type { Repository } from '@typings/repos';

export default function Repo({ repository }: { repository: Repository }) {
    const { meta_tags, full_name, html_url, languages } = repository;
    const languageIter = Object.entries(languages) as [Language, number][];
    const totalCount = languageIter.reduce((pre, cur) => pre + cur[1], 0);
    return (
        <>
            <Link
                href={`/repos/${repository.name}`}
                className="box-border text-sm font-medium leading-tight break-words text-slate-300"
            >
                링크를 클릭하면 리포지토리로 이동합니다.
            </Link>
            <Link aria-label={meta_tags?.title ?? full_name} href={html_url}>
                <RepoCard repository={repository} />
            </Link>
            <LanguageStateBar
                languages={languageIter}
                totalCount={totalCount}
            />
            <ul className="p-0 mt-0 list-none">
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
        </>
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
