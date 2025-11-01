import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

import { github, myName } from '@/lib/constants';

import MenuButtons from './menu';
import ProfileBio from './profile';
import StackList from './stacks';

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='bg-background mx-auto my-0 max-w-[55rem] transition-all lg:max-w-[82.5rem]'>
      <summary className='xl:scrollbar-hide block overflow-x-hidden px-4 py-4 text-base md:px-10 md:pt-10 md:pb-4 lg:inline-block xl:top-0 xl:max-h-screen xl:min-h-screen xl:w-[30rem] xl:overflow-y-auto xl:pb-16'>
        <MenuButtons />
        <h1 className='writer mx-0 my-4 text-2xl leading-normal'>
          <Link href={github} className='writer-text'>
            {myName}
          </Link>
        </h1>
        <section className='mt-0 border-t-0 px-0 py-0 text-base'>
          <Link href={github}>
            <Image
              src={'/images/profile.jpg'}
              alt={myName}
              width={156}
              height={156}
              className='rounded-full print:hidden'
            />
          </Link>
          <ProfileBio />
          <StackList />
        </section>
      </summary>
      <main className='xl:scrollbar-hide block overflow-x-hidden px-4 py-4 pt-0 text-base md:px-10 md:py-10 lg:inline-block xl:max-h-screen xl:min-h-screen xl:w-[calc(100%-30rem)] xl:overflow-y-auto'>
        <article>{children}</article>
      </main>
    </div>
  );
}
