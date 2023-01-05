import { differenceInDays as diff, format, parseISO } from 'date-fns';
import Period from '@components/common/period';
import { ReactElement } from 'react';
import type { Resume } from '@typings/profile';
import names from 'classnames';
import styles from '@styles/timeline.module.css';
import { renderToString as toHtml } from 'react-dom/server';

export default function GridTimeline({ timeline }: { timeline: Resume[] }) {
    const { monthsLabels, makeBlock } = getMonthLabels();
    return (
        <div className={names(styles.body,)}>
            <div className={names(styles.card_item,)}>
                <div className={names(styles.timeline_wrap,)}>
                    <div className={names(styles.timeline_labels,)}>
                        {monthsLabels}
                    </div>
                    <div className={names(styles.grid_timeline,)}>
                        {timeline.map((action) => makeBlock(action))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const getMonthLabels = () => {
    const now = new Date();
    const monthsLabels: ReactElement[] = [];
    while (monthsLabels.length < 11) {
        const month = format(now, 'yy.MM')
        const label = <time key={month} className={names(styles.year,)} dateTime={month}>{month}</time>;
        monthsLabels.unshift(label);
        now.setMonth(now.getMonth() - 2);
    }
    const latest = new Date();
    const oldest = now;
    const pixel = 100 / diff(latest, oldest);
    const makeBlock = (action: Resume) => {
        const { type, id, name, startAt, endAt } = action;
        const end = endAt ? parseISO(endAt) : latest;
        const sPoint = Math.round(
            diff(parseISO(startAt), oldest) * pixel
        );
        const ePoint = Math.round(
            diff(end, oldest) * pixel
        );
        if (sPoint <= 0 || ePoint <= 0) return null;
        const gridColumn = `${sPoint} / ${ePoint}`;
        const popOverHtml = (
            <Period
                startAt={startAt}
                endAt={format(end, 'yyyy-MM-dd')}
                className={names(styles.text_mute,)}
            />
        );
        return (
            <span
                key={id}
                title={name}
                data-original-title={name}
                data-type={type}
                data-html={true}
                data-toggle="popover"
                data-placement="top"
                data-content={toHtml(popOverHtml)}
                className={names(styles.event_item,)}
                style={{ gridColumn }}
            >
                {name}
            </span>
        );

    }
    return { monthsLabels, makeBlock };
}