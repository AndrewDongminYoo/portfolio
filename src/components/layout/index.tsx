import Image from 'next/image';
import Link from 'next/link';

import { github, myName } from '@/lib/constants';

import MenuButtons from './menu';
import ProfileBio from './profile';
import StackList from './stacks';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='mx-auto my-0 max-w-[55rem] bg-background transition-all lg:max-w-[82.5rem]'>
      <MenuButtons />
      <summary className='block overflow-x-hidden px-4 py-4 text-base md:px-10 md:pt-10 md:pb-4 lg:inline-block xl:top-0 xl:scrollbar-hide xl:max-h-screen xl:min-h-screen xl:w-[30rem] xl:overflow-y-auto xl:pb-16'>
        <h1 className='mx-0 my-4 writer pt-8 text-2xl leading-normal sm:pt-0'>
          <Link href='/' className='writer-text'>
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
      <main className='block overflow-x-hidden px-4 py-4 pt-0 text-base md:px-10 md:py-10 lg:inline-block xl:scrollbar-hide xl:max-h-screen xl:min-h-screen xl:w-[calc(100%-30rem)] xl:overflow-y-auto'>
        <article>{children}</article>
      </main>
    </div>
  );
}
