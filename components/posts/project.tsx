import Description from '@components/common/description';
import Link from 'next/link';
import Period from '@components/common/period';
import type { Project } from '@typings/profile';
import SlugIcon from '@components/slug_icon';
import names from 'classnames';
import styles from '@styles/resume.module.css';

export default function ProjectElement({ project }: { project: Project }) {
    const websiteUrl =
        project.website_url ?? 'https://andrewdongminyoo.github.io/';
    const repository =
        project.repository ?? 'https://github.com/andrewdongminyoo';
    const startAt = project.startAt ?? '진행 예정';
    const endAt = project.startAt ? project.endAt ?? '진행중' : '';
    return (
        <div className={names(styles.resume_card_item, project.type)}>
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
                    href={`/posts/${project.id}`}
                >
                    {project.title}
                </Link>
                <ul className={styles.tag_list}>
                    {project.tags.map((tag, i) => (
                        <li key={i}>{tag}</li>
                    ))}
                </ul>
                <div className={names(styles.markdown, styles.markdown_viewer)}>
                    <Description resume={project} />
                </div>
                <ul className={styles.list_contributions}>
                    <li className={styles.list_contribution_item}>
                        <SlugIcon
                            icon={'discord'}
                            size={14}
                            color={'gray'}
                            className={styles.slug__icon}
                        />
                        {project.teamDescription}
                    </li>
                    <li className={styles.list_contribution_item}>
                        <SlugIcon
                            icon={'github'}
                            size={14}
                            color={'gray'}
                            className={styles.slug__icon}
                        />
                        <Link href={repository} target="_blank" rel="noopener">
                            {repository}
                        </Link>
                    </li>
                    <li className={styles.list_contribution_item}>
                        <SlugIcon
                            icon={'bloglovin'}
                            size={14}
                            color={'gray'}
                            className={styles.slug__icon}
                        />
                        <Link href={websiteUrl} target="_blank" rel="noopener">
                            {websiteUrl}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}