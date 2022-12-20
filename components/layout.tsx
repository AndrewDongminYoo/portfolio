import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import ProfileBio from './profile'

const name = 'Andrew Dong-min, Yoo'
export const siteTitle = '집요하게 더 나은 답을 찾아내는 개발자 유동민입니다.'
const laundry = "https://scontent-ssn1-1.xx.fbcdn.net/v/t1.6435-9/86294625_3679572472082984_2974853671021445120_n.jpg?stp=dst-jpg_p843x403&_nc_cat=102&ccb=1-7&_nc_sid=0debeb&_nc_ohc=9TfMzUXute4AX_10tZ3&_nc_ht=scontent-ssn1-1.xx&oh=00_AfCjf0g049LSM4CqkNbgIxS-6niTPTfTSEY3Bt07rhlzrg&oe=63AAD0D3"
const description = "좋은 개발자가 되기 위해 계속해서 성장하고자 하는 집요함을 가지고 있습니다. 일상적으로 만나는 모든 문제들에 더 효율적이고 효과적인 답을 찾기 위해 끊임없이 고민하고 사유합니다. 함께 성장하는 좋은 동료가 되기 위해 노력하겠습니다."

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
                <Link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content='서버/백엔드, 웹 풀스택, 크로스플랫폼개발, 개발자 구인' />
                <meta name="og:description" property="og:description" itemProp="description" content={description} />
                <meta name="og:image" property="og:image" itemProp="image primaryImageOfPage" content={laundry} />
                <meta name="og:title" content={siteTitle} itemProp="title name" />
                <meta name="og:url" property="og:url" content="https://andrewdongminyoo.github.io/" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:description" property="og:description" itemProp="description" content={description} />
                <meta name="twitter:image" property="og:image" itemProp="image primaryImageOfPage" content={laundry} />
                <meta name="twitter:title" property="og:title" itemProp="title name" content={siteTitle} />
                <meta name="twitter:url" property="og:url" content="https://andrewdongminyoo.github.io/" />
                <meta http-equiv="x-ua-compatible" content="ie=edge" />
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
            </header>
            <div className={styles.resume__detail}>
                <main className={styles.body}>{children}</main>
                {!home && (
                    <div className={styles.backToHome}>
                        <Link href="/">← Back to home</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
