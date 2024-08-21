import { Experience, Project } from 'types/profile';
import { faCalendarCheck, faChrome, faSquareGithub } from 'components/common/icons';
import Description from 'components/common/description';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Period from 'components/common/period';

export default function ExperienceElement({ experience }: { experience: Experience }) {
  const startAt = experience.startAt;
  const endAt = experience.endAt ?? '재직 중';
  return (
    <div className='resume_card_item'>
      <div className='resume_card_left'>
        <h4 className='resume_card_item_period'>
          <Period startAt={startAt} endAt={endAt} className='period' />
        </h4>
      </div>
      <div className='resume_card_right'>
        <Link className='resume_card_item_label' href={`/posts/${experience.id}`}>
          {experience.title}
        </Link>
        <p className='resume_card_item_text'>{experience.role}</p>
        <ul className='tag_list'>
          {experience.tags.map((tag, i) => (
            <li key={`${i}-${tag}`}>{tag}</li>
          ))}
        </ul>
        <div className='markdown markdown_viewer'>
          <Description resume={experience} />
        </div>
        <span className='contributions_label'>상세 업무 및 성과</span>
        <ul className='list_contributions'>
          {experience.projects.map((pro, i) => (
            <Contribution project={pro} key={`${i}-${pro}`} />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Contribution = ({ project }: { project: Project }) => {
  const startAt = project.startAt ?? '개발 예정';
  const endAt = project.startAt ? (project.endAt ?? '진행중') : '';
  return (
    <li className='list_contribution_item'>
      {project.website_url != null ? (
        <h4 className='part_title'>
          <Link target='_blank' rel='noopener' href={project.website_url}>
            {project.title}
          </Link>
        </h4>
      ) : null}
      <h4 className='part_period'>
        <div className='datetime'>
          <FontAwesomeIcon
            icon={faCalendarCheck}
            className='w-4 my-0 ml-0 mr-2'
            aria-hidden='true'
            color='slateGray'
          />
          <Period startAt={startAt} endAt={endAt} />
        </div>
        {project.website_url != null ? (
          <div className='url__link'>
            <FontAwesomeIcon
              icon={faChrome}
              className='w-4 my-0 ml-0 mr-2'
              aria-hidden='true'
              color='slateGray'
            />
            {project.website_url}
          </div>
        ) : null}
        {project.repository != null ? (
          <div className='url__link'>
            <FontAwesomeIcon
              icon={faSquareGithub}
              className='w-4 my-0 ml-0 mr-2'
              aria-hidden='true'
              color='slateGray'
            />
            {project.repository}
          </div>
        ) : null}
      </h4>
      <div className='markdown markdown_viewer part_description'>
        <Description resume={project} />
      </div>
    </li>
  );
};
