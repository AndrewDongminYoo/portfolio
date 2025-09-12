import { github, myName } from '@/constants/';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import MenuButtons from './menu';
import ProfileBio from './profile';
import { ReactNode } from 'react';
import StackList from './stacks';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';

type LayoutProps = {
  children?: ReactNode;
  title: string;
};

export default function Layout({ children, title }: LayoutProps) {
  const { pathname } = useRouter();
  const isHome = pathname === '/';
  return (
    <div
      className={cn(
        'lg:max-w-[55rem]',
        'bg-background my-0 mx-auto',
        'transition-all',
        'max-w-[82.5rem]',
      )}>
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
      <summary
        className={cn(
          'xl:scrollbar-hide xl:w-[30rem]',
          'text-base overflow-x-hidden',
          'inline-block text-base p-10 pb-4',
          'xl:max-h-screen xl:min-h-screen xl:overflow-y-auto',
          'lg:block',
          'sm:p-4',
          'xs:overflow-x-hidden',
          'xl:pb-16 xl:top-0',
        )}>
        <MenuButtons />
        <h1 className='mx-0 my-4 text-2xl leading-normal writer'>
          <Link href={isHome ? github : '/'} className='writer-text'>
            {myName}
          </Link>
        </h1>
        <section className='p-0 mt-0 text-base border-t-0'>
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
      <main
        className={cn(
          'xl:scrollbar-hide xl:w-[calc(100%-30rem)]',
          'text-base overflow-x-hidden',
          'inline-block text-base p-10',
          'xl:max-h-screen xl:min-h-screen xl:overflow-y-auto',
          'lg:block',
          'sm:p-4',
          'pt-0',
        )}>
        <article>{children}</article>
        {!isHome && (
          <div className='font-extrabold leading-8'>
            <Link href='/'>🔙 {'홈으로가기'}</Link>
          </div>
        )}
      </main>
    </div>
  );
}
