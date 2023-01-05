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
import styles from '@styles/layout.module.css';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: ReactNode; }) {
    const router = useRouter();
    const isHome = router.pathname === '/';
    return (
        <div className={names(styles.resume__content,)}>
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
                <link rel="apple-touch-icon" href={favicon.src}></link>
            </Head>
            <summary className={names(styles.resume__summary, "text-gray-800 leading-snug overflow-x-hidden p-10 text-base block")}>
                <h1 className={names("text-2xl leading-normal my-4 mx-0")}>
                    <Link
                        href={isHome ? ghProfile : '/'}
                        className={names()}
                    >
                        {myName}
                    </Link>
                </h1>
                <PrintButton />
                <section className={names("mt-0 p-0 text-base")}>
                    <Link href={isHome ? ghProfile : '/'}>
                        <Image
                            src={portrait}
                            alt={myName}
                            width={156}
                            height={156}
                            className={names("rounded-full")}
                        />
                    </Link>
                    <ProfileBio />
                    <StackList />
                </section>
            </summary>
            <main className={names(styles.resume__detail, "text-gray-800 leading-snug box-border border-0 border-solid border-gray-300 overflow-x-hidden p-10 text-base block pt-0")}>
                <section className={names(styles.body,)}>{children}</section>
                {!isHome && (
                    <div className={names(styles.backToHome,)}>
                        <Link href="/">🔙 홈으로가기</Link>
                    </div>
                )}
            </main>
        </div>
    );
}