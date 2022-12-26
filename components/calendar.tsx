import { GetStaticProps } from 'next';
import React from 'react'
import { Theme } from 'react-activity-calendar';
import dynamic from 'next/dynamic';
import { getSortedPostsData } from '@lib/posts';

const GitHubCalendar = dynamic(
    () => import('react-github-calendar'),
    { ssr: false }
);

const ReactGithubCalendar = () => {
    const theme: Theme = {
        level4: '#0a3069',
        level3: '#0969da',
        level2: '#54aeff',
        level1: '#b6e3ff',
        level0: '#ebedf0',
    }
    return (
        <section>
            <GitHubCalendar
                theme={theme}
                username="AndrewDongminYoo"
                transformTotalCount={true}
            />
            <div className="contrib-column contrib-column-first table-column">
                <span className="text-muted">
                    Contributions in the last year
                </span>
                <span className="contrib-number">
                    2149 total
                </span>
                <span className="text-muted">
                    Dec 28, 2021 – Dec 27, 2022
                </span>
            </div>
            <div className="contrib-column table-column">
                <span className="text-muted">
                    Longest streak
                </span>
                <span className="contrib-number">
                    34 days
                </span>
                <span className="text-muted">
                    June 19 – July 22
                </span>
            </div>
            <div className="contrib-column table-column">
                <span className="text-muted">
                    Current streak
                </span>
                <span className="contrib-number">
                    2 days
                </span>
                <span className="text-muted">
                    December 25 – December 26
                </span>
            </div>
        </section>
    )
}



export const getStaticProps: GetStaticProps = () => {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
};

export default ReactGithubCalendar;