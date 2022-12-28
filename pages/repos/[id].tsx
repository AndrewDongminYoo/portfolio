import { GetStaticPaths, GetStaticProps } from 'next';
import { OpenGraph, Repository } from '@typings/repos';
import { getReposIds, getRepositories } from '@lib/repos';
import Image from 'next/image';
import Link from 'next/link';
import { getTagsFromWebsite } from '@lib/metatag';

const Repo = ({
    repository,
    metaTags,
}: {
    repository: Repository;
    metaTags: OpenGraph;
}) => {
    return (
        <div>
            <Link
                aria-label={metaTags?.title ?? repository.name}
                className={`uiScaledImageContainer _6m5 fbStoryAttachmentImage`}
                href={repository.html_url}
            >
                <Image
                    alt={metaTags?.['image:alt'] || repository.name}
                    src={metaTags?.image as string}
                    width={540}
                    height={270}
                    style={{ aspectRatio: 'auto 997 / 498', display: 'block' }}
                    priority={true}
                    className={`scaledImageFitWidth img`}
                />
                {metaTags?.title}
            </Link>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getReposIds();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const data = await getRepositories();
    const repository = data.find(
        (repo) => repo.id === Number(params?.id)
    ) as Repository;
    const metaTags = await getTagsFromWebsite(repository.html_url);
    return {
        props: {
            repository,
            metaTags,
        },
    };
};

export default Repo;
