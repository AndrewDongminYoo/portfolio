import { SiGithub, SiGooglechrome } from '@icons-pack/react-simple-icons';
import { CalendarCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Period from '@/components/period';
import Description from '@/features/posts/description';
import { Experience, Project } from '@/interface/profile';

export default function ExperienceElement({ experience }: { experience: Experience }) {
  const startAt = experience.startAt;
  const endAt = experience.endAt ?? '재직 중';
  return (
    <div className='resume_card_item'>
      <div className='resume_card_left'>
        <h4 className='resume_card_item_period'>
          <Period startAt={startAt} endAt={endAt} className='period' softWrap={true} monthsOnly />
        </h4>
      </div>
      <div className='resume_card_right'>
        <Link className='resume_card_item_label' href={`/posts/${experience.id}`}>
          {experience.icon ? (
            <Image
              src={experience.icon}
              alt={`${experience.name} logo`}
              width={36}
              height={36}
              className='mr-3 rounded-md'
            />
          ) : null}
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
        {experience.projects && <span className='contributions_label'>상세 업무 및 성과</span>}
        {experience.projects && (
          <ul className='list_contributions'>
            {experience.projects.map((pro, i) => (
              <Contribution project={pro} key={`${i}-${pro}`} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const Contribution = ({ project }: { project: Project }) => {
  const startAt = project.startAt ?? '개발 예정';
  const endAt = project.startAt ? (project.endAt ?? '진행중') : '';
  return (
    <li className='list_contribution_item'>
      <h4 className='part_title'>
        {project.website_url != null ? (
          <Link target='_blank' rel='noopener' href={project.website_url}>
            {project.title}
          </Link>
        ) : (
          <>{project.title}</>
        )}
      </h4>
      <h4 className='part_period'>
        <div className='datetime'>
          <CalendarCheck className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='slateGray' />
          <Period startAt={startAt} endAt={endAt} />
        </div>
        {project.website_url != null ? (
          <div className='url__link'>
            <SiGooglechrome
              className='my-0 mr-2 ml-0 h-4 w-4'
              aria-hidden='true'
              color='slateGray'
            />
            {project.website_url}
          </div>
        ) : null}
        {project.repository != null ? (
          <div className='url__link'>
            <SiGithub className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='slateGray' />
            {project.repository}
          </div>
        ) : null}
      </h4>
      <div className='markdown part_description markdown_viewer'>
        <Description resume={project} />
      </div>
    </li>
  );
};
