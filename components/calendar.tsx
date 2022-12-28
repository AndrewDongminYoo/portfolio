import { GlobalStat } from '@lib/activity';
import React from 'react'
import { Theme } from 'react-activity-calendar';
import dynamic from 'next/dynamic';
import styles from '@styles/calendar.module.css';
import { username } from '@data/constants';

const GitHubCalendar = dynamic(
    () => import('react-github-calendar'),
    { ssr: false }
);

export interface Contributions {
    firstCol: GlobalStat;
    secondCol: GlobalStat;
    thirdCol: GlobalStat;
}

const ReactGithubCalendar = ({ contributions }: { contributions: Contributions }) => {
    const theme: Theme = {
        level4: '#0a3069',
        level3: '#0969da',
        level2: '#54aeff',
        level1: '#b6e3ff',
        level0: '#ebedf0',
    }
    const { firstCol, secondCol, thirdCol } = contributions;
    return (
        <div className="calendar">
            <GitHubCalendar
                theme={theme}
                username={username}
                transformTotalCount={true}
                hideTotalCount
            />
            <Contrib key={1} contrib={firstCol} isFirst={true} />
            <Contrib key={2} contrib={secondCol} />
            <Contrib key={3} contrib={thirdCol} />
        </div>
    );
};

const Contrib = ({ contrib: { contribTitle, contribNumber, contribPeriod }, isFirst = false }: { contrib: GlobalStat, isFirst?: boolean }) => {
    const columnFirst = isFirst === true ? styles.contrib_column_first : ''
    return (
        <div className={`${styles.contrib_column} ${styles.table_column} ${columnFirst}`}>
            <span className="text-muted">
                {contribTitle}
            </span>
            <span className={styles.contrib_number}>
                {contribNumber}
            </span>
            <span className="text-muted">
                {contribPeriod}
            </span>
        </div>
    );
};

export default ReactGithubCalendar;