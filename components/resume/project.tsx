import styles from '../../styles/resume.module.css'
import Link from 'next/link'
import { Project } from '../../types/profile.types'
import Description, { Date } from '../utils'

export default function ProjectElement({ project }: { project: Project }) {
    const website_url = project.website_url ?? 'https://github.com/andrewdongminyoo'
    const repository = project.repository ?? 'https://github.com/andrewdongminyoo'
    const startAt = project.startAt ?? '진행 예정'
    const endAt = project.startAt ? (project.endAt ?? "진행중") : ""
    return (
        <div className={`${styles.resume_card_item} ${styles.project}`}>
            <div className={styles.resume_card_left}>
                <h5 className={styles.resume_card_item_period}>
                    <Date dateTime={startAt} /> ~ <Date dateTime={endAt} />
                </h5>
            </div>
            <div className={styles.resume_card_right}>
                <Link className={styles.resume_card_item_label} href={`/posts/${project.id}`}>
                    {project.title}
                </Link>
                <ul className={styles.tag_list}>
                    {project.tags.map((tag, i) => <li key={i}>{tag}</li>)}
                </ul>
                <div className={`${styles.markdown} ${styles.github} ${styles.markdown_viewer}`}>
                    <Description resume={project} />
                </div>
                <ul className={styles.list_contributions}>
                    <li className={styles.list_contribution_item}>
                        {project.teamDescription}
                    </li>
                    <li className={styles.list_contribution_item}>
                        <i className="fab fa-github" aria-hidden="true">
                        </i>
                        <Link href={repository} target="_blank" rel="noopener">{repository}
                        </Link>
                    </li>
                    <li className={styles.list_contribution_item}>
                        <i className="fab fa-youtube" aria-hidden="true">
                        </i>
                        <Link href={website_url} target="_blank" rel="noopener">
                            {website_url}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}