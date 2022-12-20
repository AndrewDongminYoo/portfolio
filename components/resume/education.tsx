import styles from "../../styles/resume.module.css";
import Link from "next/link";
import { Education } from "../../types/profile.types";
import { Date } from "../utils";

export default function EducationElement({
    education,
}: {
    education: Education;
}) {
    const startAt = education.startAt ?? "입학 예정";
    const endAt = education.startAt ? education.endAt ?? "재학 중" : "";
    return (
        <div className={`${styles.resume_card_item} ${styles.education}`}>
            <div className={styles.resume_card_left}>
                <h5 className={styles.resume_card_item_period}>
                    <Date dateTime={startAt} /> ~ <Date dateTime={endAt} />
                </h5>
            </div>
            <div className={styles.resume_card_right}>
                <Link
                    className={styles.resume_card_item_label}
                    href={`/posts/${education.id}`}
                >
                    {education.title}
                </Link>
                <h5 className={styles.resume_card_item_text}>
                    <span>{education.major} 전공</span>
                    <span> • {education.degree}</span>
                </h5>
            </div>
        </div>
    );
}
