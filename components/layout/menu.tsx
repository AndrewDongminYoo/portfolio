import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { faCodepen, faIdCard, faPrint } from '@/components/common/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { github } from '@/constants/';

export default function MenuButtons() {
  return (
    <div className='fixed top-14 right-14 z-50 flex justify-end print:hidden'>
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className='fixed'>
              <Image
                src={'/images/bg_space.webp'}
                alt='Cat Floating in Space'
                width={56}
                height={56}
                className='relative h-14 w-14 rounded-full shadow-2xl shadow-slate-700'
              />
              <Image
                src={'/images/kkori_the_cutest.png'}
                alt='My Lovely Cat'
                width={56}
                height={56}
                className='absolute right-0 z-10 h-14 w-14 animate-bounce motion-reduce:animate-none'
              />
              <span className='absolute bottom-0 left-11 h-3.5 w-3.5 animate-ping rounded-full border-2 border-white bg-green-400 motion-reduce:animate-none dark:border-gray-800' />
            </MenuButton>
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
              <MenuItems static className='rounded-2xl bg-slate-50 text-gray-900 shadow-md'>
                <MenuItem>
                  {({ focus }) => (
                    <button className='group ui-active:bg-slate-500 ui-active:text-white flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'>
                      <FontAwesomeIcon
                        icon={faPrint}
                        color='slateGray'
                        className='mr-2 h-5 w-5'
                        width={20}
                        height={20}
                        aria-hidden='true'
                        inverse={focus}
                      />
                      <Link href='#' onClick={() => window.print()}>
                        {'프린트하기'}
                      </Link>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button className='group ui-active:bg-slate-500 ui-active:text-white flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'>
                      <FontAwesomeIcon
                        icon={faCodepen}
                        color='slateGray'
                        className='mr-1 h-5 w-5'
                        width={20}
                        height={20}
                        aria-hidden='true'
                        inverse={focus}
                      />
                      <Link href='/repos' className='font-bold'>
                        {'포트폴리오'}
                      </Link>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button className='group ui-active:bg-slate-500 ui-active:text-white flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'>
                      <FontAwesomeIcon
                        icon={faIdCard}
                        color='slateGray'
                        className='mr-2 h-5 w-5'
                        width={20}
                        height={20}
                        aria-hidden='true'
                        inverse={focus}
                      />
                      <Link href={github}>{'깃헙프로필'}</Link>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
