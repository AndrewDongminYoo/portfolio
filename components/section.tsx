import { ReactNode } from 'react';
import type { SectionType } from '@typings/profile';
import styles from '@styles/resume.module.css';

export default function ResumeSection({
    children,
    type,
}: {
    children: ReactNode[] | ReactNode;
    type: SectionType;
}) {
    const subTitle = () => {
        switch (type) {
            case 'educations':
                return '학력/전공';
            case 'experiences':
                return '업무 프로젝트';
            case 'projects':
                return '개인/팀 프로젝트';
            case 'activities':
                return '활동/교육';
            case 'contributions':
                return '퍼블릭 컨트리뷰션';
            case 'timeline':
                return '타임라인';
        }
    };
    return (
        <section className={styles.resume_card}>
            <div className={styles.resume_card_header}>
                <div className={styles.resume_card_left}>
                    <h3 className={styles.resume_card_header_title}>
                        {subTitle()}
                    </h3>
                </div>
                <div className={styles.resume_card_right}></div>
            </div>
            <div className={styles.resume_card_body}>{children}</div>
        </section>
    );
}
