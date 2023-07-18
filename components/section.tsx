import React, { ComponentProps } from 'react';
import type { SectionType } from 'types/profile';

const subTitles = {
    educations: '학력/전공',
    experiences: '업무 프로젝트',
    projects: '개인/팀 프로젝트',
    activities: '활동/교육',
    contributions: '퍼블릭 컨트리뷰션',
    timeline: '타임라인',
};

/**
 * @description 'ResumeSection' 함수는 제목과 내용이 포함된 이력서 섹션을 렌더링하는 React 컴포넌트.
 * @param {ComponentProps} props - 컴포넌트에 전달되는 props
 * @param {React.ReactNode} props.children - `ResumeSection` 구성 요소 내에서 렌더링될 콘텐츠.
 * @param {SectionType} props.type - 섹션 유형.
 * @returns {React.ReactElement} <section> 내부에 다양한 중첩 요소 및 구성 요소가 있는 요소.
 */
export default function ResumeSection({
    children,
    type,
}: ComponentProps<'section'> & {
    type: SectionType;
}) {
    const subTitle = subTitles[type];
    if (children === null || children === undefined) return <></>;
    return (
        <section
            className='w-full p-6 mx-0 my-6 border border-gray-300 border-solid rounded-lg'
            id={type}>
            <div className='flex justify-between w-full'>
                <div className='flex items-center justify-start w-32 sm:w-full max-h-8'>
                    <h3 className='flex items-center justify-start text-base font-medium sm:text-sm'>
                        {subTitle}
                    </h3>
                </div>
                <div className='flex items-center justify-end w-full-9'></div>
            </div>
            <div className='w-full'>{children}</div>
        </section>
    );
}
