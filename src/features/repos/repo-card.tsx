'use client';

import { Code, Eye, GitFork, Lock, LockOpen, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CopyToClipboard } from '@/features/repos/copy-to-clipboard';
import type Repository from '@/interface/repos';
import { username } from '@/lib/constants';

import { getSimpleIcon } from './simple-icons';

export default function RepoCard({ repository }: { repository: Repository }) {
  const icon = getSimpleIcon(repository.language);
  const iconUrl = icon?.url;
  const iconColor = icon?.color ?? '#999999';
  const iconStyle = {
    backgroundColor: iconColor,
    ...(iconUrl
      ? {
          WebkitMaskImage: `url(${iconUrl})`,
          maskImage: `url(${iconUrl})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }
      : {}),
  };
  return (
    <div className='flex min-h-[17rem] flex-row overflow-hidden px-2 max-md:w-80 md:px-6'>
      <Link href={repository.html_url} className='hidden md:flex'>
        <span
          aria-hidden='true'
          className='-mx-4 hidden h-[256px] w-[256px] rounded-t rounded-l opacity-25 md:mx-0 md:flex md:max-w-10 lg:max-w-24 lg:min-w-20'
          style={iconStyle}
        />
      </Link>
      <div className='flex w-full min-w-[20.625rem] flex-col justify-between bg-background px-0 py-8 leading-normal first-letter:rounded-b md:px-12 lg:rounded-r lg:rounded-b-none'>
        <CopyToClipboard
          value={`${repository.html_url}.git`}
          className='after:content-[attr(placeholder)] hover:after:content-[attr(title)]'>
          {repository.private ? (
            <Lock className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='gray' />
          ) : (
            <LockOpen className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='gray' />
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
            <p className='mb-0 text-xxs text-gray-400'>based language</p>
            <Code className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='gray' />
            {repository.language}
          </Link>
          <Link href={`${repository.html_url}/stargazers`} className='text-xs'>
            <p className='mb-0 text-xxs text-gray-400'>stars</p>
            <p className='mb-0 text-xs text-gray-900'>
              <Star className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='gray' />
              {repository.stargazers_count}
            </p>
          </Link>
          <Link href={`${repository.html_url}/watchers`} className='text-xs'>
            <p className='mb-0 text-xxs text-gray-400'>watchers</p>
            <p className='mb-0 text-xs text-gray-900'>
              <Eye className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='gray' />
              {repository.watchers_count}
            </p>
          </Link>
          <Link href={`${repository.html_url}/fork`} className='text-xs'>
            <p className='mb-0 text-xxs text-gray-400'>forks</p>
            <p className='mb-0 text-xs text-gray-900'>
              <GitFork className='my-0 mr-2 ml-0 h-4 w-4' aria-hidden='true' color='gray' />
              {repository.forks_count}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
