import styles from '../../styles/resume.module.css'
import Link from 'next/link'
import { Activity } from '../../types/profile.types'
import Description from '../utils'

export default function ActivityElement({ activity }: { activity: Activity }) {
    return (
        <div className="resume_card_item activity">
            <div className={styles.resume_card_left}>
                <h5 className={styles.resume_card_item_period}>
                    {activity.startAt} ~ {activity.endAt}
                </h5>
            </div>
            <div className={styles.resume_card_right}>
                <Link className={styles.resume_card_item_label} href={`/posts/${activity.id}`}>
                    {activity.title}
                </Link>
                <h5 className={styles.resume_card_item_text}>
                    <Link href={activity.link ?? ""} target="_blank" rel="noopener">
                        {activity.link}
                    </Link>
                </h5>
                <div className="markdown github markdown-viewer">
                    <Description resume={activity} />
                </div>
            </div>
        </div>
    )
}