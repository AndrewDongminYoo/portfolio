import { ghProfile, myName } from '@constants';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PrintButton from './print';
import ProfileBio from './profile';
import { ReactNode } from 'react';
import StackList from './stacks';
import favicon from '@public/favicon.ico';
import laundry from '@public/images/laundry.jpg';
import names from 'classnames';
import portrait from '@public/images/profile.jpg';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: ReactNode; }) {
    const router = useRouter();
    const isHome = router.pathname === '/';
    return (
        <div
            className={names(
                'lg:max-w-[55rem]',
                'bg-white my-0 mx-auto',
                'transition-all',
                'max-w-[82.5rem]'
            )}
        >
            <Head>
                <meta
                    name="og:image"
                    property="og:image"
                    itemProp="image primaryImageOfPage"
                    content={laundry.src}
                />
                <meta
                    name="twitter:image"
                    property="og:image"
                    itemProp="image primaryImageOfPage"
                    content={laundry.src}
                />
                <link rel="apple-touch-icon" href={favicon.src} />
            </Head>
            <summary
                className={names(
                    'xl:scrollbar-hide xl:w-[30rem]',
                    'text-base overflow-x-hidden',
                    'inline-block text-base p-10 pb-4',
                    'xl:max-h-screen xl:min-h-screen xl:overflow-y-auto',
                    'lg:block',
                    'sm:p-4',
                    'xs:overflow-x-hidden',
                    'xl:pb-16 xl:top-0'
                )}
            >
                <h1 className="mx-0 my-4 text-2xl leading-normal">
                    <Link href={isHome ? ghProfile : '/'}>{myName}</Link>
                </h1>
                <PrintButton />
                <section className="p-0 mt-0 text-base border-t-0">
                    <Link href={isHome ? ghProfile : '/'}>
                        <Image
                            src={portrait}
                            alt={myName}
                            width={156}
                            height={156}
                            className="rounded-full print:hidden"
                        />
                    </Link>
                    <ProfileBio />
                    <StackList />
                </section>
            </summary>
            <main
                className={names(
                    'xl:scrollbar-hide xl:w-[calc(100%-30rem)]',
                    'text-base overflow-x-hidden',
                    'inline-block text-base p-10',
                    'xl:max-h-screen xl:min-h-screen xl:overflow-y-auto',
                    'lg:block',
                    'sm:p-4',
                    'pt-0'
                )}
            >
                <section>{children}</section>
                {!isHome && (
                    <div className="leading-8 font-bolder">
                        <Link href="/">🔙 홈으로가기</Link>
                    </div>
                )}
            </main>
        </div>
    );
}
