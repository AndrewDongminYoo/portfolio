import { description, myName, siteTitle, url } from '@data/constants';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Portrait from '@public/images/profile.jpg';
import ProfileBio from '@components/profile';
import React from 'react';
import StackList from '@components/stacks';
import favicon from '@public/favicon.ico';
import laundry from '@public/images/laundry.jpg';
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
        <html lang="ko" data-color-mode="dark" data-light-theme="light" data-dark-theme="dark_dimmed" data-a11y-animated-images="system" className={"octotree octotree-gh"} data-turbo-loaded="">
            <div className={styles.resume__content}>
                <Head>
                    <meta name="description" content={description} />
                    <meta name="og:description" property="og:description" itemProp="description" content={description} />
                    <meta name="og:image" property="og:image" itemProp="image primaryImageOfPage" content={laundry.src} />
                    <meta name="og:title" content={siteTitle} itemProp="title name" />
                    <meta name="og:url" property="og:url" content={url} />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:description" property="og:description" itemProp="description" content={description} />
                    <meta name="twitter:image" property="og:image" itemProp="image primaryImageOfPage" content={laundry.src} />
                    <meta name="twitter:title" property="og:title" itemProp="title name" content={siteTitle} />
                    <meta name="twitter:url" property="og:url" content={url} />
                    <meta name="theme-color" content="#0969da" />
                    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                    <meta httpEquiv="Content-Security-Policy" content="script-src 'none'" />
                    <link rel="apple-touch-icon" href={favicon.src}></link>
                    <title>{siteTitle}</title>
                </Head>
                <summary className={styles.resume__summary}>
                    <h2 className={utilStyles.headingLg}>
                        <Link href="/" className={utilStyles.colorInherit}>
                            {myName}
                        </Link>
                    </h2>
                    <section className={styles.information}>
                        <Link href="/">
                            <Image
                                src={Portrait}
                                className={styles.profile_image}
                                height={156}
                                width={156}
                                alt={myName}
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
                            <Link href="/">← Back to home</Link>
                        </div>
                    )}
                </main>
            </div>
        </html>
    );
};

export default Layout;
