import { differenceInDays, format, parse, parseISO } from 'date-fns';
import { Period } from './utils';
import { Resume } from '../types/profile.types';
import { renderToString } from 'react-dom/server';
import styles from '../styles/timeline.module.css';

export default function GridTimeline({ timeline }: { timeline: Resume[] }) {
    const monthsLabel = getMonths(11);
    const latest = new Date()
    const oldest = parse(monthsLabel[0], 'yy.MM', latest);
    const pixel = 100 / differenceInDays(latest, oldest)

    return (
        <div className={styles.body}>
            <div className={styles.card_item}>
                <div className={styles.timeline_wrap}>
                    <div className={styles.timeline_labels}>
                        {monthsLabel.map((month, i) => (
                            <time key={i} className={styles.year} dateTime={month}>
                                {month}
                            </time>
                        ))}
                    </div>
                    <div className={styles.grid_timeline}>
                        {timeline.map((action: Resume) => {
                            const { type, index, name, startAt, endAt } = action;
                            const start = parseISO(startAt)
                            const end = endAt ? parseISO(endAt) : new Date()
                            const sPoint = Math.round(differenceInDays(start, oldest) * pixel)
                            const ePoint = Math.round(differenceInDays(end, oldest) * pixel)
                            if (sPoint <= 0 || ePoint <= 0) return null;
                            const dataContent = <Period startAt={startAt} endAt={format(end, 'yyyy-MM-dd')} className={styles.text_mute} />
                            return (
                                <div
                                    key={index}
                                    title={name}
                                    data-original-title={name}
                                    data-html="true"
                                    data-toggle="popover"
                                    data-placement="top"
                                    data-content={renderToString(dataContent)}
                                    className={styles.event_item}
                                    style={{
                                        gridColumn: `${sPoint} / ${ePoint}`,
                                        backgroundColor: colors[type],
                                    }}
                                >{name}</div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

const getMonths = (length: number) => {
    const now = new Date();
    const monthArray: string[] = [];
    while (monthArray.length < length) {
        monthArray.unshift(format(now, 'yy.MM'));
        now.setMonth(now.getMonth() - 2);
    }
    return monthArray;
};

const colors: Record<string, string> = {
    "experience": "#34495e",
    "project": "#5d6d7e",
    "education": "#aeb6bf",
    "activity": "#85929e",
}