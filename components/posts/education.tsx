import type { Education } from '@typings/profile';
import Link from 'next/link';
import Period from '@components/common/period';
import names from 'classnames';
import styles from '@styles/resume.module.css';

export default function EducationElement({
    education,
}: {
    education: Education;
}) {
    const startAt = education.startAt ?? '입학 예정';
    const endAt = education.startAt ? education.endAt ?? '재학 중' : '';
    return (
        <div className={names(styles.resume_card_item, 'education')}>
            <div className={styles.resume_card_left}>
                <h4 className={styles.resume_card_item_period}>
                    <Period
                        startAt={startAt}
                        endAt={endAt}
                        className={styles.period}
                    />
                </h4>
            </div>
            <div className={styles.resume_card_right}>
                <Link
                    className={styles.resume_card_item_label}
                    href={`/posts/${education.id}`}
                >
                    {education.title}
                </Link>
                <p className={styles.resume_card_item_text}>
                    <span>{education.major} 전공</span>
                    <span> • {education.degree}</span>
                </p>
            </div>
        </div>
    );
}
