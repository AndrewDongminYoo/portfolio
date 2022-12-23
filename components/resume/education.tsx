import { Education } from "../../types/profile.types";
import Link from "next/link";
import { Period } from "../utils";
import styles from "../../styles/resume.module.css";

const EducationElement = ({
    education,
}: {
    education: Education;
}) => {
    const startAt = education.startAt ?? "입학 예정";
    const endAt = education.startAt ? education.endAt ?? "재학 중" : "";
    return (
        <div className={`${styles.resume_card_item} education`}>
            <div className={styles.resume_card_left}>
                <h5 className={styles.resume_card_item_period}>
                    <Period startAt={startAt} endAt={endAt} className={styles.period} />
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

export default EducationElement;