import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Portrait from '@public/images/profile.jpg';
import PrintButton from '@components/print';
import ProfileBio from '@components/profile';
import React from 'react';
import StackList from '@components/stacks';
import favicon from '@public/favicon.ico';
import laundry from '@public/images/laundry.jpg';
import { myName } from '@data/constants';
import styles from '@styles/layout.module.css';
import utilStyles from '@styles/utils.module.css';

const Layout = ({
    children,
    sub = false,
}: {
    children: React.ReactNode;
    sub?: boolean;
}) => {
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
                    <Link href="/" className={utilStyles.colorInherit}>
                        {myName}
                    </Link>
                </h1>
                <PrintButton/>
                <section className={styles.information}>
                    <Link href="/">
                        <Image
                            src={Portrait}
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
                {sub && (
                    <div className={styles.backToHome}>
                        <Link href="/">🔙 홈으로가기</Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Layout;
