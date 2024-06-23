import { github, myName } from '@/constants/';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import MenuButton from './menu';
import ProfileBio from './profile';
import { ReactNode } from 'react';
import StackList from './stacks';
import { cn } from 'lib/utils';
import favicon from '@/public/favicon.ico';
import laundry from '@/public/images/laundry.jpg';
import portrait from '@/public/images/profile.jpg';
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
      className={cn('lg:max-w-4xl', 'bg-background my-0 mx-auto', 'transition-all', 'max-w-7xl')}>
      <Head>
        <meta
          name='og:image'
          property='og:image'
          itemProp='image primaryImageOfPage'
          content={laundry.src}
        />
        <meta
          name='twitter:image'
          property='og:image'
          itemProp='image primaryImageOfPage'
          content={laundry.src}
        />
        <meta name='keywords' content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인' />
        <link rel='icon' href={favicon.src} />
        <link rel='apple-touch-icon' href={favicon.src} />
        <title>{title}</title>
      </Head>
      <summary
        className={cn(
          'xl:scrollbar-hide xl:w-120',
          'text-base overflow-x-hidden',
          'inline-block text-base p-10 pb-4',
          'xl:max-h-screen xl:min-h-screen xl:overflow-y-auto',
          'lg:block',
          'sm:p-4',
          'xs:overflow-x-hidden',
          'xl:pb-16 xl:top-0',
        )}>
        <MenuButton />
        <h1 className='mx-0 my-4 text-2xl leading-normal writer'>
          <Link href={isHome ? github : '/'} className='writer-text'>
            {myName}
          </Link>
        </h1>
        <section className='p-0 mt-0 text-base border-t-0'>
          <Link href={isHome ? github : '/'}>
            <Image
              src={portrait}
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
          'xl:scrollbar-hide xl:w-full-30',
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
