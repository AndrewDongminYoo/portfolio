import React from 'react';
import Script from 'next/script';
import { username } from '@data/constants';

function onLoad() {
    if (
        'GitHubCalendar' in window &&
        typeof window.GitHubCalendar === 'function'
    ) {
        window.GitHubCalendar('.calendar', username, {
            responsive: true,
            global_stats: true,
            tooltips: true,
        });
    }
};

const inlineStyle = `
.calendar  {
    --color-calendar-graph-day-L1-bg: #b6e3ff;
    --color-calendar-graph-day-L2-bg: #54aeff;
    --color-calendar-graph-day-L3-bg: #0969da;
    --color-calendar-graph-day-L4-bg: #0a3069;
    --color-calendar-graph-day-bg: #ebedf0;
}

.calendar {
    border: none;
}

.calendar .float-right {
    font-weight: 100;
    font-size: smaller;
}`;

export default function ReactGithubCalendar() {
    return (
        <>
            <link
                rel="stylesheet"
                href="https://unpkg.com/github-calendar@latest/dist/github-calendar-responsive.css"
                referrerPolicy="strict-origin-when-cross-origin"
            ></link>
            <style>{inlineStyle}</style>
            <div className="calendar">
                <Script
                    src="https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js"
                    onReady={onLoad}
                />
            </div>
        </>
    );
}
