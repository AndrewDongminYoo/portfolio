import styles from '../styles/profile.module.css'
import Link from 'next/link'

export default function ProfileBio() {
    return (
        <section className={styles.information}>
            <div className={styles.name}>
                <h1>집요하게 더 나은 답을 찾아내는 개발자 유동민입니다.</h1>
            </div>
            <ul className={styles.contacts}>
                <li className="phone">
                    <Link href="tel:01035661857">
                        <img
                            height={28}
                            alt="tel:01035661857"
                            src="https://img.shields.io/badge/call-01035661857-blue?style=for-the-badge&logo=apple" />
                    </Link>
                </li>
                <li className="email">
                    <Link href="mailto:ydm2790@gmail.com">
                        <img
                            height={28}
                            alt="email:ydm2790@gmail.com"
                            src="https://img.shields.io/badge/mail-ydm2790@gmail.com-black?style=for-the-badge&logo=gmail" />
                    </Link>
                </li>
                <li className="repo">
                    <Link href="https://github.com/AndrewDongminYoo" target="_blank" rel="noopener">
                        <img
                            height={28}
                            alt="repo:https://github.com/AndrewDongminYoo"
                            src="https://img.shields.io/badge/'git'-AndrewDongminYoo-lightgreen?style=for-the-badge&logo=github" />
                    </Link>
                </li>
                <li className="youtube">
                    <Link href="https://www.youtube.com/watch?v=vOh90eJ7VdY" target="_blank" rel="noopener">
                        <img
                            height={28}
                            alt="youtube:https://www.youtube.com/watch?v=vOh90eJ7VdY"
                            src="https://img.shields.io/badge/'ytb'-vOh90eJ7VdY-red?style=for-the-badge&logo=youtube" />
                    </Link>
                </li>
            </ul>
            <div className={styles.description}>
                <div>
                    <div>
                        <p>좋은 개발자가 되기 위해 계속해서 성장하고자 하는 집요함을 가지고 있습니다. 일상적으로 만나는 모든 문제들에 더 효율적이고 효과적인 답을
                            찾기 위해 끊임없이 고민하고 사유합니다. 함께 성장하는 좋은 동료가 되기 위해 노력하겠습니다.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}