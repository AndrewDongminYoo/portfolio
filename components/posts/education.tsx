import type { Education } from '@typings/profile';
import Link from 'next/link';
import Period from '@components/common/period';
import names from 'classnames';

export default function EducationElement({
    education,
}: {
    education: Education;
}) {
    const startAt = education.startAt ?? '입학 예정';
    const endAt = education.startAt ? education.endAt ?? '재학 중' : '';
    return (
        <div className={names('resume_card_item',)}>
            <div className={names('resume_card_left', "w-32 max-sm:w-full",)}>
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
                    href={`/posts/${education.id}`}
                >
                    {education.title}
                </Link>
                <p className={names('resume_card_item_text',)}>
                    <span>{education.major} 전공</span>
                    <span> • {education.degree}</span>
                </p>
            </div>
        </div>
    );
}
