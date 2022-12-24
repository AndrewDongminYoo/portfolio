import { GetStaticPaths, GetStaticProps } from 'next'
import { getReposIds, getReposLanguages } from '../../lib/repos'
import Image from 'next/image';
import Link from 'next/link';
import { Repository } from '../../types/repos.types';
import Script from 'next/script';
import { setMetaTagsOnRepo } from '../../lib/facebook';
import { useState } from 'react';

const Repo = ({ repository }: { repository: Repository }) => {
    const [metaRepo, setMetaTagOfRepo] = useState(repository)
    const [ready, setReady] = useState(false)
    return (
        <div>
            <Script
                src="https://connect.facebook.net/en_US/sdk.js"
                strategy="lazyOnload"
                onLoad={async () => {
                    await setMetaTagsOnRepo(repository)
                        .then(setMetaTagOfRepo)
                        .then(() => setReady(true))
                }}
            />
            <div id="u_0_2_GE" data-ft={'{ "tn": "H" }'}>
                <Link aria-describedby="u_0_4_/f"
                    aria-label={metaRepo.meta_tags?.title}
                    tabIndex={-1}
                    target="_blank"
                    rel="noopener nofollow"
                    data-lynx-mode="asynclazy"
                    href={repository.html_url}>
                    <div
                        className={`uiScaledImageContainer _6m5 fbStoryAttachmentImage`}
                        style={{ width: 524, height: 273.444444444 }}>
                        {ready && <Image
                            alt={repository.description as string}
                            data-src={metaRepo.meta_tags?.image[0].url as string}
                            src={metaRepo.meta_tags?.image[0].url as string}
                            width={524}
                            height={274}
                            decoding="async"
                            data-nimg={1}
                            className={`scaledImageFitWidth img`}
                            loading="lazy"
                            style={{ color: "transparent", top: 0 }} />}
                    </div>
                </Link>
            </div>
            <Link rel="noopener nofollow"
                target="_blank"
                data-lynx-mode="asynclazy"
                href={repository.html_url}>
                {`GitHub - ${repository.full_name}: ${repository.description ?? ""}`}
            </Link>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getReposIds()
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const data = await getReposLanguages()
    return {
        props: {
            repository: data.find((repo) => repo.id === Number(params?.id))
        }
    }
}

export default Repo;
