import styles from "../../styles/resume.module.css";
import Link from "next/link";
import { Experience, Project } from "../../types/profile.types";
import Description, { Date } from "../utils";

export default function ExperienceElement({
    experience,
}: {
    experience: Experience;
}) {
    const startAt = experience.startAt;
    const endAt = experience.endAt ?? "재직 중";
    return (
        <div className={`${styles.resume_card_item} ${styles.experience}`}>
            <div className={styles.resume_card_left}>
                <h5 className={styles.resume_card_item_period}>
                    <Date dateTime={startAt} /> ~ <Date dateTime={endAt} />
                    <span className={styles.period}>({experience.duration}개월)</span>
                </h5>
            </div>
            <div className={styles.resume_card_right}>
                <Link
                    className={styles.resume_card_item_label}
                    href={`/posts/${experience.id}`}
                >
                    {experience.title}
                </Link>
                <h5 className={styles.resume_card_item_text}>{experience.role}</h5>
                <ul className={styles.tag_list}>
                    {experience.tags.map((tag, i) => (
                        <li key={i}>{tag}</li>
                    ))}
                </ul>
                <div
                    className={`${styles.markdown} ${styles.github} ${styles.markdown_viewer}`}
                >
                    <Description resume={experience} />
                </div>
                <ul className={styles.list_contributions}>
                    {experience.projects.map((pro, i) => (
                        <Contribution project={pro} key={i} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

const Contribution = ({ project }: { project: Project }) => {
    const websiteUrl = project.website_url ?? "https://cat-minzzi.tistory.com/";
    const repository =
        project.repository ?? "https://github.com/andrewdongminyoo";
    const startAt = project.startAt ?? "개발 예정";
    const endAt = project.startAt ? project.endAt ?? "진행중" : "";
    return (
        <li className={styles.list_contribution_item}>
            <h5 className={styles.part_title}>
                <Link target="_blank" rel="noopener" href={websiteUrl}>
                    {project.title}
                </Link>
            </h5>
            <h6 className={styles.part_period}>
                <Date dateTime={startAt} /> ~ <Date dateTime={endAt} />
                <Link className={styles.url__link} href={websiteUrl}>
                    <i className="fas fa-blog" aria-hidden="true" />
                    {websiteUrl}
                </Link>
                <Link className={styles.url__link} href={repository}>
                    <i className="fab fa-github-square" aria-hidden="true" />
                    {repository}
                </Link>
            </h6>
            <div
                className={`${styles.markdown} ${styles.github} ${styles.markdown_viewer} ${styles.part_description}`}
            >
                <Description resume={project} />
            </div>
        </li>
    );
};
