import { ghProfile, myName } from '@constants';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PrintButton from './print';
import ProfileBio from './profile';
import React from 'react';
import StackList from './stacks';
import favicon from '@public/favicon.ico';
import laundry from '@public/images/laundry.jpg';
import portrait from '@public/images/profile.jpg';
import styles from '@styles/layout.module.css';
import useMobileDetect from '@components/common/platform';
import { useRouter } from 'next/router';
import utilStyles from '@styles/utils.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isMobile] = useMobileDetect();
    const isHome = router.pathname === '/';
    return (
        <div className={styles.resume__content}>
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
            <summary className={styles.resume__summary}>
                <h1 className={utilStyles.headingLg}>
                    <Link
                        href={isHome ? ghProfile : '/'}
                        className={utilStyles.colorInherit}
                    >
                        {myName}
                    </Link>
                </h1>
                <PrintButton visible={!isMobile} />
                <section className={styles.information}>
                    <Link href={isHome ? ghProfile : '/'}>
                        <Image
                            src={portrait}
                            alt={myName}
                            width={156}
                            height={156}
                            className={styles.profile_image}
                        />
                    </Link>
                    <ProfileBio />
                    <StackList />
                </section>
            </summary>
            <main className={styles.resume__detail}>
                <section className={styles.body}>{children}</section>
                {!isHome && (
                    <div className={styles.backToHome}>
                        <Link href="/">🔙 홈으로가기</Link>
                    </div>
                )}
            </main>
        </div>
    );
}
