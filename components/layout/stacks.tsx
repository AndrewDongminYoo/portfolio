import { stacks } from '@constants';
import styles from '@styles/stacks.module.css';

export default function StackList() {
    return (
        <section className={styles.stacks}>
            <div className={styles.stacks__primary}>
                <div className={styles.resume_section_title}>
                    <span>주요 기술</span>
                    <span className={styles.count}>4개</span>
                </div>
                <ul className={styles.list_stack}>
                    {stacks.primaryTags.map((stack, i) => {
                        return (
                            <li className={styles.col_item} key={i}>
                                <div className={styles.stack_item}>{stack}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={styles.stacks__secondary}>
                <div className={styles.resume_section_title}>
                    <span>기술 태그</span>
                </div>
                <ul className={styles.list_stack}>
                    {stacks.technicalTags.map((stack, i) => {
                        return (
                            <li className={styles.col_item} key={i}>
                                <div className={styles.stack_item}>{stack}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}