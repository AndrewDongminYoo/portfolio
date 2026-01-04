import { SiMedium } from '@icons-pack/react-simple-icons';
import Image from 'next/image';
import Link from 'next/link';

import Period from '@/components/period';
import Description from '@/features/posts/description';
import type { Activity } from '@/interface/profile';

export default function ActivityElement({ activity }: { activity: Activity }) {
  const startAt = activity.startAt ?? '개발 예정';
  const endAt = activity.startAt ? (activity.endAt ?? '진행중') : '';
  return (
    <div className='resume_card_item'>
      <div className='resume_card_left'>
        <h4 className='resume_card_item_period'>
          <Period startAt={startAt} endAt={endAt} className='period' />
        </h4>
      </div>
      <div className='resume_card_right'>
        <Link
          className='resume_card_item_label'
          href={activity.website_url ?? `/posts/${activity.id}`}>
          {activity.icon ? (
            <Image
              src={activity.icon}
              alt={`${activity.name} logo`}
              width={40}
              height={40}
              className='mr-3 rounded-md'
            />
          ) : null}
          {activity.title}
        </Link>
        <p className='resume_card_item_text' style={{ fontSize: 14 }}>
          {activity.posting_url ? (
            <Link href={activity.posting_url} target='_blank' rel='noopener'>
              <SiMedium className='size-3' /> {activity.subtitle}
            </Link>
          ) : null}
        </p>
        <div className='markdown markdown_viewer'>
          <Description resume={activity} />
        </div>
      </div>
    </div>
  );
}
