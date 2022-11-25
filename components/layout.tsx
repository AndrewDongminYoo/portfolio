import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import ProfileBio from './profile'

const name = 'Andrew Dong-min, Yoo'
export const siteTitle = '집요하게 더 나은 답을 찾아내는 개발자 유동민입니다.'

export default function Layout({
    children,
    home
}: {
    children: React.ReactNode
    home?: boolean
}) {
    return (
        <div className={styles.resume__content}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="좋은 개발자가 되기 위해 계속해서 성장하고자 하는 집요함을 가지고 있습니다. 일상적으로 만나는 모든 문제들에 더 효율적이고 효과적인 답을 찾기 위해 끊임없이 고민하고 사유합니다. 함께 성장하는 좋은 동료가 되기 위해 노력하겠습니다."
                />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <header className={styles.resume__summary}>
                <h2 className={utilStyles.headingLg}>
                    <Link href="/" className={utilStyles.colorInherit}>
                        {name}
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
                            alt={name}
                        />
                    </Link>
                    <ProfileBio />
                </section>
                <main className={styles.body}>{children}</main>
                {!home && (
                    <div className={styles.backToHome}>
                        <Link href="/">← Back to home</Link>
                    </div>
                )}
            </header>
        </div>
    )
}
