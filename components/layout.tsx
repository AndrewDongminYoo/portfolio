import { description, laundry, myName, siteTitle, url } from '../data/constants';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ProfileBio from './profile';
import StackList from '../components/stacks';
import styles from '../styles/layout.module.css';
import utilStyles from '../styles/utils.module.css';

export default function Layout({
    children,
    home,
}: {
    children: React.ReactNode;
    home?: boolean;
}) {
    return (
        <div className={styles.resume__content}>
            <Head>
                <meta name="description" content={description} />
                <meta name="og:description" property="og:description" itemProp="description" content={description} />
                <meta name="og:image" property="og:image" itemProp="image primaryImageOfPage" content={laundry} />
                <meta name="og:title" content={siteTitle} itemProp="title name" />
                <meta name="og:url" property="og:url" content={url} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:description" property="og:description" itemProp="description" content={description} />
                <meta name="twitter:image" property="og:image" itemProp="image primaryImageOfPage" content={laundry} />
                <meta name="twitter:title" property="og:title" itemProp="title name" content={siteTitle} />
                <meta name="twitter:url" property="og:url" content={url} />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
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
                            priority
                            src="/images/profile.jpg"
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
                {!home && (
                    <div className={styles.backToHome}>
                        <Link href="/">← Back to home</Link>
                    </div>
                )}
            </main>
        </div>
    );
}