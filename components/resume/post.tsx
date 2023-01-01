import { ActivityElement, EducationElement, ExperienceElement, ProjectElement } from '@components/resume';
import { ParsedUrlQuery } from 'node:querystring';
import { Resume } from '@typings/profile';
import { selfAPIAxios } from '@lib/fetcher';

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
};

export const getStaticProps = async ({ params }: { params: ParsedUrlQuery }) => {
    const data = (
        await selfAPIAxios.get(`/api/posts?id=${params.id}`).then((res) => res.data)
    ).data as Resume[];
    return {
        props: {
            data,
        },
    };
};
