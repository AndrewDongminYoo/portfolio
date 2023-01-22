import type { GetStaticPaths, GetStaticProps } from 'next';
import { readData, readReposIds } from '@/lib/repos';
import type { Language } from '@/components/repos/lang_colors';
import LanguageButton from '@/components/repos/lang_btn';
import LanguageStateBar from '@/components/repos/langs_bar';
import Link from 'next/link';
import RepoCard from '@/components/repos/card';
import type { Repository } from '@/types/repos';
import names from 'classnames';

export default function Repo({ repository }: { repository: Repository }) {
    const { full_name, html_url, languages } = repository;
    const languageIter = Object.entries(languages) as [Language, number][];
    const totalCount = languageIter.reduce((pre, cur) => pre + cur[1], 0);
    return (
        <article aria-label='repositories'>
            <Link
                href={html_url}
                className={names(
                    'box-border leading-tight break-words',
                    'text-sm font-medium text-slate-300'
                )}>
                {full_name}
            </Link>
            <RepoCard repository={repository} />
            <LanguageStateBar languages={languageIter} totalCount={totalCount} />
            <ul className='p-0 mt-0 list-none'>
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
        </article>
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
