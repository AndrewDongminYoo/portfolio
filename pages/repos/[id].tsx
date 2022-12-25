import { GetStaticPaths, GetStaticProps } from 'next';
import { getReposIds, getTagsFromRepository } from '@lib/repos';
import Image from 'next/image';
import Link from 'next/link';
import { Repository } from '@typings/repos';

const Repo = ({ repository }: { repository: Repository }) => {
    return (
        <div>
            <Link
                aria-label={repository.meta_tags?.title ?? repository.name}
                className={`uiScaledImageContainer _6m5 fbStoryAttachmentImage`}
                href={repository.html_url}
            >
                <Image
                    alt={repository.meta_tags?.['image:alt'] || repository.name}
                    src={repository.meta_tags?.image as string}
                    width={540}
                    height={270}
                    style={{ aspectRatio: 'auto 997 / 498', display: 'block' }}
                    priority={true}
                    className={`scaledImageFitWidth img`}
                />
                {repository.meta_tags?.title}
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
    const data = await getTagsFromRepository();
    return {
        props: {
            repository: data.find((repo) => repo.id === Number(params?.id)),
        },
    };
};

export default Repo;
