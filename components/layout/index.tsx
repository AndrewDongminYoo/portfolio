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
import localFont from '@next/font/local';
import names from 'classnames';
import portrait from '@public/images/profile.jpg';
import styles from '@styles/layout.module.css';
import useMobileDetect from '@components/common/platform';
import { useRouter } from 'next/router';
import utilStyles from '@styles/utils.module.css';

const noto = localFont({
    preload: true,
    display: 'swap',
    src: [
        { path: "../../public/fonts/NotoSansKR-Thin.otf", weight: '100', style: 'normal' },
        { path: "../../public/fonts/NotoSansKR-Light.otf", weight: '300', style: 'normal' },
        { path: "../../public/fonts/NotoSansKR-Regular.otf", weight: '400', style: 'normal' },
        { path: "../../public/fonts/NotoSansKR-Medium.otf", weight: '500', style: 'normal' },
        { path: "../../public/fonts/NotoSansKR-Bold.otf", weight: '700', style: 'normal' },
        { path: "../../public/fonts/NotoSansKR-Black.otf", weight: '900', style: 'normal' },
    ],
});

export default function Layout({ children }: { children: ReactNode; }) {
    const router = useRouter();
    const [isMobile] = useMobileDetect();
    const isHome = router.pathname === '/';
    return (
        <div className={names(styles.resume__content, noto.className)}>
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

Layout.getStaticProps = () => {
    const { className } = noto;
    return {
        props: {
            className
        }
    };
};
