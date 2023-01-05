import type { Activity } from '@typings/profile';
import Description from '@components/common/description';
import Link from 'next/link';
import Period from '@components/common/period';
import names from 'classnames';
import styles from '@styles/resume.module.css';

export default function ActivityElement({ activity }: { activity: Activity }) {
    const startAt = activity.startAt ?? '개발 예정';
    const endAt = activity.startAt ? activity.endAt ?? '진행중' : '';
    return (
        <div className={names(styles.resume_card_item, activity.type)}>
            <div className={names(styles.resume_card_left,)}>
                <h4 className={names(styles.resume_card_item_period,)}>
                    <Period
                        startAt={startAt}
                        endAt={endAt}
                        className={names(styles.period,)}
                    />
                </h4>
            </div>
            <div className={names(styles.resume_card_right,)}>
                <Link
                    className={names(styles.resume_card_item_label,)}
                    href={`/posts/${activity.id}`}
                >
                    {activity.title}
                </Link>
                <p className={names(styles.resume_card_item_text,)}>
                    <Link
                        href={activity.website_url ?? ''}
                        target="_blank"
                        rel="noopener"
                    >
                        {activity.website_url}
                    </Link>
                </p>
                <div className={names(styles.markdown, styles.markdown_viewer)}>
                    <Description resume={activity} />
                </div>
            </div>
        </div>
    );
}
