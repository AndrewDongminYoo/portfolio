import {
    faCodeFork,
    faEye,
    faLaptopCode,
    faLock,
    faLockOpen,
    faStar,
} from '@components/common/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { Repository } from '@typings/repos';
import { frameworks } from './lang_icons';
import { username } from '@constants';

export default function RepoCard({ repository }: { repository: Repository; }) {
    return (
        <div className="flex flex-row px-6 overflow-hidden min-h-68">
            <Link href={`https://github.com/search?l=${repository.language}&q=user%3A${username}&type=Code`}>
                <Image
                    src={frameworks[repository.name]}
                    className="flex h-auto text-center rounded-t rounded-l opacity-25 max-w-40 sm:overflow-x-hidden"
                    alt="What Framework/Library used by this repository"
                />
            </Link>
            <div className="flex flex-col justify-between py-8 px-12 leading-normal bg-white min-w-82.5 w-full rounded-blg:rounded-b-none lg:rounded-r">
                <div className="">
                    <p className="flex items-center mb-0 text-xs text-gray-600">
                        {repository.private ? (
                            <FontAwesomeIcon
                                icon={faLock}
                                className="w-4 h-4 my-0 ml-0 mr-2"
                                aria-hidden="true"
                                size="2x"
                                color="gray"
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faLockOpen}
                                className="w-4 h-4 my-0 ml-0 mr-2"
                                aria-hidden="true"
                                size="2x"
                                color="gray"
                            />
                        )}
                        {`${repository.visibility}`}
                    </p>
                    <div className="flex justify-between text-gray-900">
                        <div className="inline-block">
                            <p className="mb-0 text-2xl">
                                {repository.owner.login}/
                            </p>
                            <p className="text-3xl font-bold break-all">
                                {repository.name}
                            </p>
                        </div>
                        <Image
                            src={repository.owner.avatar_url}
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
                            <FontAwesomeIcon
                                className="w-4 h-4 mr-2 stroke-2 ui-active:fill-gray-500 fill-gray-100 ui-active:stroke-gray-300 stroke-400"
                                icon={faLaptopCode}
                                // className="w-4 h-4 my-0 ml-0 mr-2"
                                aria-hidden="true"
                                size="2x"
                                color="gray"
                            />
                            {repository.language}
                        </p>
                    </div>
                    <div className="text-xs">
                        <p className="mb-0 text-gray-400 text-xxs">stars</p>
                        <p className="mb-0 text-xs text-gray-900">
                            <FontAwesomeIcon
                                icon={faStar}
                                className="w-4 h-4 my-0 ml-0 mr-2"
                                aria-hidden="true"
                                size="2x"
                                color="gray"
                            />
                            {repository.stargazers_count}
                        </p>
                    </div>
                    <div className="text-xs">
                        <p className="mb-0 text-gray-400 text-xxs">watchers</p>
                        <p className="mb-0 text-xs text-gray-900">
                            <FontAwesomeIcon
                                icon={faEye}
                                className="w-4 h-4 my-0 ml-0 mr-2"
                                aria-hidden="true"
                                size="2x"
                                color="gray"
                            />
                            {repository.watchers_count}
                        </p>
                    </div>
                    <div className="text-xs">
                        <p className="mb-0 text-gray-400 text-xxs">folks</p>
                        <p className="mb-0 text-xs text-gray-900">
                            <FontAwesomeIcon
                                icon={faCodeFork}
                                className="w-4 h-4 my-0 ml-0 mr-2"
                                aria-hidden="true"
                                size="2x"
                                color="gray"
                            />
                            {repository.forks_count}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
