import names from 'classnames';
import { stacks } from '@constants';
import styles from '@styles/stacks.module.css';

export default function StackList() {
    return (
        <section className={names(styles.stacks,)}>
            <div className={names(styles.stacks__primary,)}>
                <div className={names(styles.resume_section_title,)}>
                    <span>주요 기술</span>
                    <span className={names(styles.count,)}>4개</span>
                </div>
                <ul className={names(styles.list_stack,)}>
                    {stacks.primaryTags.map((stack, i) => {
                        return (
                            <li className={names(styles.col_item,)} key={i}>
                                <div className={names(styles.stack_item,)}>{stack}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={names(styles.stacks__secondary,)}>
                <div className={names(styles.resume_section_title,)}>
                    <span>기술 태그</span>
                </div>
                <ul className={names(styles.list_stack,)}>
                    {stacks.technicalTags.map((stack, i) => {
                        return (
                            <li className={names(styles.col_item,)} key={i}>
                                <div className={names(styles.stack_item,)}>{stack}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
