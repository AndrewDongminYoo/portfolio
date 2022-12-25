import stacks from '@data/stacks.json';
import styles from '@styles/stacks.module.css';

const StackList = () => {
    return (
        <section className={styles.stacks}>
            <div className={styles.stacks__primary}>
                <div className={styles.resume_section_title}>
                    <span>주요 기술</span>
                    <span className={styles.count}>4개</span>
                </div>
                <ul className={styles.list_stack}>
                    {stacks.primaryTags.map((stack, i) => {
                        return <StackElement stack={stack} key={i} />;
                    })}
                </ul>
            </div>
            <div className={styles.stacks__secondary}>
                <div className={styles.resume_section_title}>
                    <span>기술 태그</span>
                </div>
                <ul className={styles.list_stack}>
                    {stacks.technicalTags.map((stack, i) => {
                        return <StackElement stack={stack} key={i} />;
                    })}
                </ul>
            </div>
        </section>
    );
};

const StackElement = ({ stack }: { stack: string }) => {
    return (
        <li className={styles.col_item}>
            <div className={styles.stack_item}>{stack}</div>
        </li>
    );
};

export default StackList;