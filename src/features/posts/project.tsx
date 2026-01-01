import { SiGithub, SiGooglechrome } from '@icons-pack/react-simple-icons';
import { Users } from 'lucide-react';
import Link from 'next/link';

import Period from '@/components/period';
import Description from '@/features/posts/description';
import type { Project } from '@/interface/profile';

export default function ProjectElement({ project }: { project: Project }) {
  const websiteUrl = project.website_url ?? 'https://andrewdongminyoo.vercel.app/';
  const repository = project.repository ?? 'https://github.com/andrewdongminyoo';
  const startAt = project.startAt ?? '진행 예정';
  const endAt = project.startAt ? (project.endAt ?? '진행중') : '';
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
            <Users className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='slateGray' />
            {project.teamDescription}
          </li>
          <li className='list_contribution_item'>
            <SiGithub className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='slateGray' />
            <Link href={repository} target='_blank' rel='noopener'>
              {repository}
            </Link>
          </li>
          <li className='list_contribution_item'>
            <SiGooglechrome
              className='my-0 mr-2 ml-0 h-4 w-4'
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
