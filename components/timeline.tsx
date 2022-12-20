import { format } from 'date-fns';
import styles from '../styles/timeline.module.css';

export default function GridTimeline() {
    return (
        <section className={styles.timeline}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <h4 className={styles.header_title}>타임라인</h4>
                </div>
                <div className={styles.right}></div>
            </div>
            <div className={styles.body}>
                <div className={styles.card_item}>
                    <div className={styles.timeline_wrap}>
                        <div className={styles.timeline_labels}>
                            {getMonths(11).map((month, i) => (
                                <time key={i} className={styles.year}>
                                    {month}
                                </time>
                            ))}
                        </div>
                        <div className={styles.grid_timeline}>
                            <div
                                data-original-title="세종사이버대학교 소프트웨어공학과"
                                data-html="true"
                                data-toggle="popover"
                                data-placement="top"
                                className={styles.event_item}
                                style={{
                                    gridColumn: '49 / 76',
                                    backgroundColor: '#7890a0',
                                }}
                            >
                                세종사이버대학교 소프트웨어공학과
                            </div>
                            <div
                                data-original-title="주식회사아이브코리아 백엔드 개발자"
                                data-html="true"
                                data-toggle="popover"
                                data-placement="top"
                                className={styles.event_item}
                                style={{
                                    gridColumn: '49 / 67',
                                    backgroundColor: '#44576c',
                                }}
                            >
                                주식회사아이브코리아 백엔드 개발자
                            </div>
                            <div
                                data-original-title="주식회사비사이드코리아 백엔드/모바일 개발자"
                                data-html="true"
                                data-toggle="popover"
                                data-placement="top"
                                className={styles.event_item}
                                style={{
                                    gridColumn: '67 / 88',
                                    backgroundColor: '#44576c',
                                }}
                            >
                                주식회사비사이드코리아 백엔드/모바일 개발자
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
