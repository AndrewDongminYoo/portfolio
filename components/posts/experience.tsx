import { Experience, Project } from '@typings/profile';
import Description from '@components/common/description';
import Link from 'next/link';
import Period from '@components/common/period';
import SlugIcon from '@components/slug_icon';
import names from 'classnames';

export default function ExperienceElement({
    experience,
}: {
    experience: Experience;
}) {
    const startAt = experience.startAt;
    const endAt = experience.endAt ?? '재직 중';
    return (
        <div className={names('resume_card_item',)}>
            <div className={names('resume_card_left',)}>
                <h4 className={names('resume_card_item_period',)}>
                    <Period
                        startAt={startAt}
                        endAt={endAt}
                        className={names('period',)}
                    />
                </h4>
            </div>
            <div className={names('resume_card_right',)}>
                <Link
                    className={names('resume_card_item_label',)}
                    href={`/posts/${experience.id}`}
                >
                    {experience.title}
                </Link>
                <p className={names('resume_card_item_text',)}>
                    {experience.role}
                </p>
                <ul className={names('tag_list',)}>
                    {experience.tags.map((tag, i) => (
                        <li key={i}>{tag}</li>
                    ))}
                </ul>
                <div className={names('markdown', 'markdown_viewer')}>
                    <Description resume={experience} />
                </div>
                <label className={names('contributions_label',)}>
                    상세 업무 및 성과
                </label>
                <ul className={names('list_contributions',)}>
                    {experience.projects.map((pro, i) => (
                        <Contribution project={pro} key={i} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

const Contribution = ({ project }: { project: Project }) => {
    const websiteUrl = project.website_url ?? 'https://cat-minzzi.tistory.com/';
    const repository =
        project.repository ?? 'https://github.com/andrewdongminyoo';
    const startAt = project.startAt ?? '개발 예정';
    const endAt = project.startAt ? project.endAt ?? '진행중' : '';
    return (
        <li className={names('list_contribution_item',)}>
            <h4 className={names('part_title',)}>
                <Link target="_blank" rel="noopener" href={websiteUrl}>
                    {project.title}
                </Link>
            </h4>
            <h4 className={names('part_period',)}>
                <div className={names('datetime',)}>
                    <SlugIcon
                        icon={'googlecalendar'}
                        size={14}
                        color={'gray'}
                        className={names('slug__icon',)}
                    />
                    <Period startAt={startAt} endAt={endAt} />
                </div>
                <div className={names('url__link',)}>
                    <SlugIcon
                        icon={'blogger'}
                        size={14}
                        color={'gray'}
                        className={names('slug__icon',)}
                    />
                    {websiteUrl}
                </div>
                <div className={names('url__link',)}>
                    <SlugIcon
                        icon={'github'}
                        size={14}
                        color={'gray'}
                        className={names('slug__icon',)}
                    />
                    {repository}
                </div>
            </h4>
            <div
                className={names(
                    'markdown',
                    'markdown_viewer',
                    'part_description'
                )}
            >
                <Description resume={project} />
            </div>
        </li>
    );
};
