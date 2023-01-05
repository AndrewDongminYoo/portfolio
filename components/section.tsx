import { ReactElement } from 'react';
import type { SectionType } from '@typings/profile';
import names from 'classnames';

export default function ResumeSection({
    children,
    type,
}: {
    children: ReactElement[] | ReactElement;
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
        <section className={names("w-full rounded-lg border border-solid border-gray-300 p-6 my-6 mx-0")}>
            <div className={names("w-full flex justify-between")}>
                <div className={names("flex justify-start items-center w-32 max-sm:w-full max-h-8")}>
                    <h3 className={names("font-medium text-base sm:text-sm leading-5 flex justify-start items-center")}>
                        {subTitle()}
                    </h3>
                </div>
                <div className={names("flex justify-end items-center w-[calc(100%-9rem)]")}></div>
            </div>
            <div className={names("w-full")}>{children}</div>
        </section>
    );
}
