import React, { ComponentProps, useState } from 'react';
import {
  faCodeFork,
  faEye,
  faLaptopCode,
  faLock,
  faLockOpen,
  faStar,
} from 'components/common/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import type Repository from 'types/repos';
import { Transition } from '@headlessui/react';
import { cn } from 'lib/utils';
import frameworks from './lang_icons';
import { username } from '@/constants/';

export default function RepoCard({ repository }: { repository: Repository }) {
  return (
    <div className='flex flex-row px-6 overflow-hidden  sm:px-2 sm:w-80 min-h-68'>
      <Link href={repository.html_url} className='sm:hidden'>
        <Image
          src={frameworks[repository.name]}
          alt='What Framework/Library used by this repository'
          priority={true}
          height={256}
          className={cn(
            'flex h-full rounded-t rounded-l opacity-25',
            'xl:max-w-24 lg:max-w-24 lg:min-w-20 md:max-w-10',
            'sm:hidden -sm:mx-4',
          )}
        />
      </Link>
      <div
        className={cn(
          'flex flex-col justify-between',
          'py-8 px-12 sm:px-0 leading-normal bg-background min-w-82.5 w-full',
          'first-letter:rounded-b lg:rounded-b-none lg:rounded-r',
        )}>
        <CopyToClipboard
          value={`${repository.html_url}.git`}
          className='after:content-[attr(placeholder)] hover:after:content-[attr(title)]'>
          {repository.private ? (
            <FontAwesomeIcon
              icon={faLock}
              className='w-4 h-4 my-0 ml-0 mr-2'
              aria-hidden='true'
              size='2x'
              width={16}
              height={16}
              color='gray'
            />
          ) : (
            <FontAwesomeIcon
              icon={faLockOpen}
              className='w-4 h-4 my-0 ml-0 mr-2'
              aria-hidden='true'
              size='2x'
              width={16}
              height={16}
              color='gray'
            />
          )}
        </CopyToClipboard>
        <div className='flex justify-between text-gray-900'>
          <Link href={repository.html_url} className='inline-block'>
            <p className='mb-0 text-2xl sm:text-lg'>{repository.owner.login}/</p>
            <p className='text-3xl font-bold break-all sm:text-xl sm:tracking-tight'>
              {repository.name}
            </p>
          </Link>
          <Image
            src={repository.owner.avatar_url}
            className='m-4 rounded-xl w-14 h-14'
            width={56}
            height={56}
            alt={repository.owner.login}
          />
        </div>
        <p className='text-sm text-gray-500 xs:text-xs xl:text-xs break-keep'>
          {repository.description}
        </p>
        <div className='w-full grid grid-cols-4 gap-x-2'>
          <Link
            href={`https://github.com/search?l=${repository.language}&q=user%3A${username}&type=Code`}
            className='text-xs'>
            <p className='mb-0 text-gray-400 text-xxs'>based language</p>
            <FontAwesomeIcon
              icon={faLaptopCode}
              className='w-4 h-4 my-0 ml-0 mr-2'
              aria-hidden='true'
              size='2x'
              width={16}
              height={16}
              color='gray'
            />
            {repository.language}
          </Link>
          <Link href={`${repository.html_url}/stargazers`} className='text-xs'>
            <p className='mb-0 text-gray-400 text-xxs'>stars</p>
            <p className='mb-0 text-xs text-gray-900'>
              <FontAwesomeIcon
                icon={faStar}
                className='w-4 h-4 my-0 ml-0 mr-2'
                aria-hidden='true'
                size='2x'
                width={16}
                height={16}
                color='gray'
              />
              {repository.stargazers_count}
            </p>
          </Link>
          <Link href={`${repository.html_url}/watchers`} className='text-xs'>
            <p className='mb-0 text-gray-400 text-xxs'>watchers</p>
            <p className='mb-0 text-xs text-gray-900'>
              <FontAwesomeIcon
                icon={faEye}
                className='w-4 h-4 my-0 ml-0 mr-2'
                aria-hidden='true'
                size='2x'
                width={16}
                height={16}
                color='gray'
              />
              {repository.watchers_count}
            </p>
          </Link>
          <Link href={`${repository.html_url}/fork`} className='text-xs'>
            <p className='mb-0 text-gray-400 text-xxs'>folks</p>
            <p className='mb-0 text-xs text-gray-900'>
              <FontAwesomeIcon
                icon={faCodeFork}
                className='w-4 h-4 my-0 ml-0 mr-2'
                aria-hidden='true'
                size='2x'
                width={16}
                height={16}
                color='gray'
              />
              {repository.forks_count}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

const CopyToClipboard = (props: ComponentProps<'button'> & { value: string }) => {
  const [isShowing, setIsShowing] = useState(false);
  const { className, children, value } = props;
  return (
    <>
      <button
        title="Click to Copy Repository's git address."
        className={cn('flex items-center mb-0 text-xs text-gray-600 cursor-pointer', className)}
        onClick={() => {
          setIsShowing(true);
          navigator.clipboard.writeText(value);
          console.debug(value);
        }}>
        {children}
      </button>
      <Transition
        static
        as='div'
        show={isShowing}
        className={cn(
          'px-1 my-0 ml-0 mr-1 py-0.5 w-fit',
          'text-xs text-foreground whitespace-nowrap',
          'bg-slate-200 border-0 rounded',
        )}
        enter='transition-opacity duration-150'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        entered='delay-500'
        afterEnter={() => setIsShowing(false)}
        leave='transition-opacity duration-150'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        {`${value} is Copied!!`}.
      </Transition>
    </>
  );
};
