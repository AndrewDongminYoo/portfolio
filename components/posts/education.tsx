import Link from 'next/link';

import Period from '@/components/common/period';
import type { Education } from '@/types/profile';

export default function EducationElement({ education }: { education: Education }) {
  const startAt = education.startAt ?? '입학 예정';
  const endAt = education.startAt ? (education.endAt ?? '졸업 예정') : '';
  return (
    <div className='resume_card_item'>
      <div className='resume_card_left w-full sm:w-32'>
        <h4 className='resume_card_item_period'>
          <Period startAt={startAt} endAt={endAt} className='period' datesOnly />
        </h4>
      </div>
      <div className='resume_card_right'>
        <Link className='resume_card_item_label' href={`/posts/${education.id}`}>
          {education.title}
        </Link>
        <p className='resume_card_item_text'>
          <span>{education.major} 전공</span>
          <span> • {education.degree}</span>
        </p>
      </div>
    </div>
  );
}
