import { Menu, Transition } from '@headlessui/react';
import { faCodepen, faIdCard, faPrint } from 'components/common/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import backgroundImage from '@/public/images/bg_space.webp';
import cat from '@/public/images/kkori_the_cutest.png';
import { cn } from 'lib/utils';
import { github } from '@/constants/';

export default function MenuButton() {
  return (
    <div className='fixed z-50 flex justify-end print:hidden top-14 right-14'>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className='fixed'>
              <Image
                src={backgroundImage}
                alt='Cat Floating in Space'
                width={56}
                height={56}
                quality={10}
                className='relative rounded-full shadow-2xl shadow-slate-700 w-14 h-14'
              />
              <Image
                src={cat}
                alt='My Lovely Cat'
                width={56}
                height={56}
                className={cn(
                  'absolute right-0 z-10 w-14 h-14',
                  'animate-bounce motion-reduce:animate-none',
                )}
              />
              <span
                className={cn(
                  'animate-ping motion-reduce:animate-none',
                  'bottom-0 left-11 absolute w-3.5 h-3.5',
                  'bg-green-400 border-2 border-white dark:border-gray-800 rounded-full',
                )}
              />
            </Menu.Button>
            {/* Use the `Transition` component. */}
            <Transition
              show={open}
              enter='transition duration-100 ease-out'
              enterFrom='transform scale-95 opacity-0'
              enterTo='transform scale-100 opacity-100'
              leave='transition duration-75 ease-out'
              leaveFrom='transform scale-100 opacity-100'
              leaveTo='transform scale-95 opacity-0'>
              {/* Mark this component as `static` */}
              <Menu.Items static className='text-gray-900 shadow-md rounded-md bg-slate-50'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        'flex items-center w-full p-2 text-sm rounded-md',
                        'text-gray-900 ui-active:bg-slate-500 ui-active:text-white group',
                      )}>
                      <FontAwesomeIcon
                        icon={faPrint}
                        color='slateGray'
                        className='w-5 h-5 mr-2'
                        width={20}
                        height={20}
                        aria-hidden='true'
                        inverse={active}
                      />
                      <Link href='#' onClick={() => window.print()}>
                        {'프린트하기'}
                      </Link>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        'flex items-center w-full p-2 text-sm rounded-md',
                        'text-gray-900 ui-active:bg-slate-500 ui-active:text-white group',
                      )}>
                      <FontAwesomeIcon
                        icon={faCodepen}
                        color='slateGray'
                        className='w-5 h-5 mr-1'
                        width={20}
                        height={20}
                        aria-hidden='true'
                        inverse={active}
                      />
                      <Link href='/repos' className='font-bold'>
                        {'포트폴리오'}
                      </Link>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        'flex items-center w-full p-2 text-sm rounded-md',
                        'text-gray-900 ui-active:bg-slate-500 ui-active:text-white group',
                      )}>
                      <FontAwesomeIcon
                        icon={faIdCard}
                        color='slateGray'
                        className='w-5 h-5 mr-2'
                        width={20}
                        height={20}
                        aria-hidden='true'
                        inverse={active}
                      />
                      <Link href={github}>{'깃헙프로필'}</Link>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
