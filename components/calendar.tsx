import Script from 'next/script';
import { username } from '@constants';

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
}

export default function ReactGithubCalendar() {
    return (
        <div className="calendar">
            <Script
                src="https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js"
                onReady={onLoad}
            />
        </div>
    );
}
