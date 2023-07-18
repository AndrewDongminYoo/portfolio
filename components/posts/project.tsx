import { faBloggerB, faDiscord, faSquareGithub } from 'components/common/icons';
import Description from 'components/common/description';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Period from 'components/common/period';
import type { Project } from 'types/profile';

export default function ProjectElement({ project }: { project: Project }) {
    const websiteUrl = project.website_url ?? 'https://andrewdongminyoo.vercel.app/';
    const repository = project.repository ?? 'https://github.com/andrewdongminyoo';
    const startAt = project.startAt ?? '진행 예정';
    const endAt = project.startAt ? project.endAt ?? '진행중' : '';
    return (
        <div className='resume_card_item'>
            <div className='resume_card_left'>
                <h4 className='resume_card_item_period'>
                    <Period startAt={startAt} endAt={endAt} className='period' />
                </h4>
            </div>
            <div className='resume_card_right'>
                <Link className='resume_card_item_label' href={`/posts/${project.id}`}>
                    {project.title}
                </Link>
                <ul className='tag_list'>
                    {project.tags.map((tag, i) => (
                        <li key={`${i}-${tag}`}>{tag}</li>
                    ))}
                </ul>
                <div className='markdown markdown_viewer'>
                    <Description resume={project} />
                </div>
                <ul className='list_contributions'>
                    <li className='list_contribution_item'>
                        <FontAwesomeIcon
                            icon={faDiscord}
                            className='w-4 my-0 ml-0 mr-2'
                            aria-hidden='true'
                            color='slateGray'
                        />
                        {project.teamDescription}
                    </li>
                    <li className='list_contribution_item'>
                        <FontAwesomeIcon
                            icon={faSquareGithub}
                            className='w-4 my-0 ml-0 mr-2'
                            aria-hidden='true'
                            color='slateGray'
                        />
                        <Link href={repository} target='_blank' rel='noopener'>
                            {repository}
                        </Link>
                    </li>
                    <li className='list_contribution_item'>
                        <FontAwesomeIcon
                            icon={faBloggerB}
                            className='w-4 my-0 ml-0 mr-2'
                            aria-hidden='true'
                            color='slateGray'
                        />
                        <Link href={websiteUrl} target='_blank' rel='noopener'>
                            {websiteUrl}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
