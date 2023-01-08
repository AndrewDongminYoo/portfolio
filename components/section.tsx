import { ComponentProps } from 'react';
import type { SectionType } from '@typings/profile';

export default function ResumeSection({
    children,
    type,
}: ComponentProps<"section"> & {
    type: SectionType;
}) {
    const subTitle = () => {
        switch (type) {
            case 'educations':
                return '학력/전공';
            case 'experiences':
                return '업무 프로젝트';
            case 'projects':
                return '개인/팀 프로젝트';
            case 'activities':
                return '활동/교육';
            case 'contributions':
                return '퍼블릭 컨트리뷰션';
            case 'timeline':
                return '타임라인';
        }
    };
    return (
        <section className="w-full p-6 mx-0 my-6 border border-gray-300 border-solid rounded-lg">
            <div className="flex justify-between w-full">
                <div className="flex items-center justify-start w-32 sm:w-full max-h-8">
                    <h3 className="flex items-center justify-start text-base font-medium sm:text-sm">
                        {subTitle()}
                    </h3>
                </div>
                <div className="flex items-center justify-end w-full-9"></div>
            </div>
            <div className="w-full">{children}</div>
        </section>
    );
}
