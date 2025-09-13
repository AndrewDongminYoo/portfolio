import { github, myName } from '@/constants/';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import MenuButtons from './menu';
import ProfileBio from './profile';
import { ReactNode } from 'react';
import StackList from './stacks';
import { useRouter } from 'next/router';

type LayoutProps = {
  children?: ReactNode;
  title: string;
};

export default function Layout({ children, title }: LayoutProps) {
  const { pathname } = useRouter();
  const isHome = pathname === '/';
  return (
    <div className='bg-background mx-auto my-0 max-w-[55rem] transition-all lg:max-w-[82.5rem]'>
      <Head>
        <meta
          name='og:image'
          property='og:image'
          itemProp='image primaryImageOfPage'
          content={'/images/laundry.jpg'}
        />
        <meta
          name='twitter:image'
          property='og:image'
          itemProp='image primaryImageOfPage'
          content={'/images/laundry.jpg'}
        />
        <meta name='keywords' content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인' />
        <link rel='icon' href={'/favicon.ico'} />
        <link rel='apple-touch-icon' href={'/favicon.ico'} />
        <title>{title}</title>
      </Head>
      <summary className='xl:scrollbar-hide block overflow-x-hidden px-4 py-4 text-base md:px-10 md:pt-10 md:pb-4 lg:inline-block xl:top-0 xl:max-h-screen xl:min-h-screen xl:w-[30rem] xl:overflow-y-auto xl:pb-16'>
        <MenuButtons />
        <h1 className='writer mx-0 my-4 text-2xl leading-normal'>
          <Link href={isHome ? github : '/'} className='writer-text'>
            {myName}
          </Link>
        </h1>
        <section className='mt-0 border-t-0 px-0 py-0 text-base'>
          <Link href={isHome ? github : '/'}>
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
        {!isHome && (
          <div className='leading-8 font-extrabold'>
            <Link href='/'>🔙 {'홈으로가기'}</Link>
          </div>
        )}
      </main>
    </div>
  );
}
