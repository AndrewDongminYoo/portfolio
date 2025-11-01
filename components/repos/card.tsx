import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { ComponentProps, useState } from 'react';

import {
  faCodeFork,
  faEye,
  faLaptopCode,
  faLock,
  faLockOpen,
  faStar,
} from '@/components/common/icons';
import { username } from '@/constants/';
import { cn } from '@/src/lib/utils';
import type Repository from '@/types/repos';

import frameworks from './lang_icons';

export default function RepoCard({ repository }: { repository: Repository }) {
  return (
    <div className='flex min-h-[17rem] flex-row overflow-hidden px-2 max-md:w-80 md:px-6'>
      <Link href={repository.html_url} className='hidden md:flex'>
        <Image
          src={frameworks[repository.name]}
          alt='What Framework/Library used by this repository'
          priority={true}
          height={256}
          width={256}
          className='-mx-4 hidden h-full rounded-t rounded-l opacity-25 md:mx-0 md:flex md:max-w-10 lg:max-w-24 lg:min-w-20'
        />
      </Link>
      <div className='bg-background flex w-full min-w-[20.625rem] flex-col justify-between px-0 py-8 leading-normal first-letter:rounded-b md:px-12 lg:rounded-r lg:rounded-b-none'>
        <CopyToClipboard
          value={`${repository.html_url}.git`}
          className='after:content-[attr(placeholder)] hover:after:content-[attr(title)]'>
          {repository.private ? (
            <FontAwesomeIcon
              icon={faLock}
              className='my-0 mr-2 ml-0 h-4 w-4'
              aria-hidden='true'
              size='2x'
              width={16}
              height={16}
              color='gray'
            />
          ) : (
            <FontAwesomeIcon
              icon={faLockOpen}
              className='my-0 mr-2 ml-0 h-4 w-4'
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
            <p className='text-xl font-bold tracking-tight break-all md:text-3xl md:tracking-normal'>
              {repository.name}
            </p>
          </Link>
          <Image
            src={repository.owner.avatar_url}
            className='mx-4 my-4 h-14 w-14 rounded-xl'
            width={56}
            height={56}
            alt={repository.owner.login}
          />
        </div>
        <p className='text-sm break-keep text-gray-500 md:text-xs'>{repository.description}</p>
        <div className='grid w-full grid-cols-4 gap-x-2'>
          <Link
            href={`https://github.com/search?l=${repository.language}&q=user%3A${username}&type=Code`}
            className='text-xs'>
            <p className='text-xxs mb-0 text-gray-400'>based language</p>
            <FontAwesomeIcon
              icon={faLaptopCode}
              className='my-0 mr-2 ml-0 h-4 w-4'
              aria-hidden='true'
              size='2x'
              width={16}
              height={16}
              color='gray'
            />
            {repository.language}
          </Link>
          <Link href={`${repository.html_url}/stargazers`} className='text-xs'>
            <p className='text-xxs mb-0 text-gray-400'>stars</p>
            <p className='mb-0 text-xs text-gray-900'>
              <FontAwesomeIcon
                icon={faStar}
                className='my-0 mr-2 ml-0 h-4 w-4'
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
            <p className='text-xxs mb-0 text-gray-400'>watchers</p>
            <p className='mb-0 text-xs text-gray-900'>
              <FontAwesomeIcon
                icon={faEye}
                className='my-0 mr-2 ml-0 h-4 w-4'
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
            <p className='text-xxs mb-0 text-gray-400'>folks</p>
            <p className='mb-0 text-xs text-gray-900'>
              <FontAwesomeIcon
                icon={faCodeFork}
                className='my-0 mr-2 ml-0 h-4 w-4'
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
        className={cn('mb-0 flex cursor-pointer items-center text-xs text-gray-600', className)}
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
        className='text-foreground my-0 mr-1 ml-0 w-fit rounded border-0 bg-slate-200 px-1 py-0.5 text-xs whitespace-nowrap'
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
