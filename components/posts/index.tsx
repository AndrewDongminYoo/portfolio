import ActivityElement from './activity';
import EducationElement from './education';
import ExperienceElement from './experience';
import ProjectElement from './project';
import type { Resume } from '@typings/profile';

export default function Post({ data }: { data: Resume }) {
    switch (data.type) {
        case 'education':
            return <EducationElement education={data} />;
        case 'experience':
            return <ExperienceElement experience={data} />;
        case 'project':
            return <ProjectElement project={data} />;
        case 'activity':
            return <ActivityElement activity={data} />;
    }
}