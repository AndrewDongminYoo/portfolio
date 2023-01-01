import { differenceInDays as diff, format, parse, parseISO } from 'date-fns';
import { Period } from '@components/utils';
import { Resume } from '@typings/profile';
import { renderToString } from 'react-dom/server';
import styles from '@styles/timeline.module.css';

const GridTimeline = ({ timeline }: { timeline: Resume[] }) => {
    const monthsLabel = getMonths(11);
    const latest = new Date();
    const oldest = parse(monthsLabel[0], 'yy.MM', latest);
    const pixel = 100 / diff(latest, oldest);

    return (
        <div className={styles.body}>
            <div className={styles.card_item}>
                <div className={styles.timeline_wrap}>
                    <div className={styles.timeline_labels}>
                        {monthsLabel.map((month, i) => (
                            <time key={i} className={styles.year} dateTime={month}>{month}</time>
                        ))}
                    </div>
                    <div className={styles.grid_timeline}>
                        {timeline.map((action: Resume) => {
                            const { type, id, name, startAt, endAt } = action;
                            const end = endAt ? parseISO(endAt) : new Date();
                            const sPoint = Math.round(diff(parseISO(startAt), oldest) * pixel);
                            const ePoint = Math.round(diff(end, oldest) * pixel);
                            if (sPoint <= 0 || ePoint <= 0) {
                                return null;
                            } else {
                                const gridColumn = `${sPoint} / ${ePoint}`;
                                const dataContent = (
                                    <Period
                                        startAt={startAt}
                                        endAt={format(end, 'yyyy-MM-dd')}
                                        className={styles.text_mute}
                                    />
                                );
                                const [backgroundColor, color] = colors[type];
                                const style = { gridColumn, backgroundColor, color };
                                return (
                                    <div
                                        key={id}
                                        title={name}
                                        data-original-title={name}
                                        data-html={true}
                                        data-toggle="popover"
                                        data-placement="top"
                                        data-content={renderToString(dataContent)}
                                        className={styles.event_item}
                                        style={style}
                                    >
                                        {name}
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const getMonths = (length: number) => {
    const now = new Date();
    const monthArray: string[] = [];
    while (monthArray.length < length) {
        monthArray.unshift(format(now, 'yy.MM'));
        now.setMonth(now.getMonth() - 2);
    }
    return monthArray;
};

const colors: Record<string, [string, string]> = {
    experience: ['#34495e', '#A4B9CB'],
    project: ['#5d6d7e', '#F2F2F2'],
    education: ['#aeb6bf', '#474747'],
    activity: ['#85929e', '#292929'],
};

export default GridTimeline;
