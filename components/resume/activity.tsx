import Description, { Period } from "../utils";
import { Activity } from "../../types/profile.types";
import Link from "next/link";
import styles from "../../styles/resume.module.css";

export default function ActivityElement({ activity }: { activity: Activity }) {
    const startAt = activity.startAt ?? "개발 예정";
    const endAt = activity.startAt ? activity.endAt ?? "진행중" : "";
    return (
        <div className={`${styles.resume_card_item} ${styles.activity}`}>
            <div className={styles.resume_card_left}>
                <h5 className={styles.resume_card_item_period}>
                    <Period startAt={startAt} endAt={endAt} className={styles.period} />
                </h5>
            </div>
            <div className={styles.resume_card_right}>
                <Link
                    className={styles.resume_card_item_label}
                    href={`/posts/${activity.id}`}
                >
                    {activity.title}
                </Link>
                <h5 className={styles.resume_card_item_text}>
                    <Link href={activity.link ?? ""} target="_blank" rel="noopener">
                        {activity.link}
                    </Link>
                </h5>
                <div
                    className={`${styles.markdown} ${styles.github} ${styles.markdown_viewer}`}
                >
                    <Description resume={activity} />
                </div>
            </div>
        </div>
    );
}
