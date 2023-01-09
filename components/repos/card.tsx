import { EyeIcon, LockClosedIcon, LockOpenIcon, ShareIcon, StarIcon, SwatchIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Repository } from '@typings/repos';
import { frameworks } from './lang_icons';
import { ghProfile } from '@constants';

export default function RepoCard({ repository }: { repository: Repository; }) {
    return (
        <div className="flex flex-row px-6 overflow-hidden min-h-68">
            <Image src={frameworks[repository.name]}
                className="flex h-auto text-center rounded-t rounded-l opacity-25 max-w-40 sm:overflow-x-hidden"
                alt={ghProfile}
            />
            <div className="flex flex-col justify-between py-8 px-12 leading-normal bg-white min-w-82.5 w-full rounded-blg:rounded-b-none lg:rounded-r">
                <div className="">
                    <p className="flex items-center mb-0 text-xs text-gray-600">
                        {repository.private
                            ? <LockClosedIcon
                                className="w-4 h-4 mr-2 stroke-2 ui-active:fill-gray-500 fill-gray-100 ui-active:stroke-gray-300 stroke-400"
                            />
                            : <LockOpenIcon
                                className="w-4 h-4 mr-2 stroke-2 ui-active:fill-gray-500 fill-gray-100 ui-active:stroke-gray-300 stroke-400"
                            />}
                        {`${repository.visibility}`}
                    </p>
                    <div className="flex justify-between text-gray-900">
                        <div className="inline-block">
                            <p className="mb-0 text-2xl">{repository.owner.login}/</p>
                            <p className="text-3xl font-bold break-all">{repository.name}</p>
                        </div>
                        <Image src={repository.owner.avatar_url}
                            className="m-4 rounded-xl w-14 h-14"
                            width={56}
                            height={56}
                            alt={repository.owner.login}
                        />
                    </div>
                    <p className="text-sm text-gray-500 xs:text-xs xl:text-xs break-keep">
                        {repository.description}
                    </p>
                </div>
                <div className="grid w-full grid-cols-4 gap-x-2">
                    <div className="text-xs">
                        <p className="mb-0 text-gray-400 text-xxs">
                            based language
                        </p>
                        <p className="mb-0 text-xs text-gray-900">
                            <SwatchIcon
                                className="w-4 h-4 mr-2 stroke-2 ui-active:fill-gray-500 fill-gray-100 ui-active:stroke-gray-300 stroke-400"
                            />{repository.language}
                        </p>
                    </div>
                    <div className="text-xs">
                        <p className="mb-0 text-gray-400 text-xxs">
                            stars
                        </p>
                        <p className="mb-0 text-xs text-gray-900">
                            <StarIcon
                                className="w-4 h-4 mr-2 stroke-2 ui-active:fill-gray-500 fill-gray-100 ui-active:stroke-gray-300 stroke-400"
                            />{repository.stargazers_count}
                        </p>
                    </div>
                    <div className="text-xs">
                        <p className="mb-0 text-gray-400 text-xxs">
                            watchers
                        </p>
                        <p className="mb-0 text-xs text-gray-900">
                            <EyeIcon
                                className="w-4 h-4 mr-2 stroke-2 ui-active:fill-gray-500 fill-gray-100 ui-active:stroke-gray-300 stroke-400"
                            />{repository.watchers_count}
                        </p>
                    </div>
                    <div className="text-xs">
                        <p className="mb-0 text-gray-400 text-xxs">
                            folks
                        </p>
                        <p className="mb-0 text-xs text-gray-900">
                            <ShareIcon
                                className="w-4 h-4 mr-2 stroke-2 ui-active:fill-gray-500 fill-gray-100 ui-active:stroke-gray-300 stroke-400"
                            />{repository.forks_count}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}