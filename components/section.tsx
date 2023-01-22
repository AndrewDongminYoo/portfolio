import { ComponentProps } from 'react';
import type { SectionType } from '@/types/profile';

const subTitles = {
    educations: '학력/전공',
    experiences: '업무 프로젝트',
    projects: '개인/팀 프로젝트',
    activities: '활동/교육',
    contributions: '퍼블릭 컨트리뷰션',
    timeline: '타임라인',
};

export default function ResumeSection({
    children,
    type,
}: ComponentProps<'section'> & {
    type: SectionType;
}) {
    const subTitle = subTitles[type];
    return (
        <section className="w-full p-6 mx-0 my-6 border border-gray-300 border-solid rounded-lg">
            <div className="flex justify-between w-full">
                <div className="flex items-center justify-start w-32 sm:w-full max-h-8">
                    <h3 className="flex items-center justify-start text-base font-medium sm:text-sm">
                        {subTitle}
                    </h3>
                </div>
                <div className="flex items-center justify-end w-full-9"></div>
            </div>
            <div className="w-full">{children}</div>
        </section>
    );
}