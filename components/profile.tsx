import Color from 'color-name'
import Icon from '../types/slug-icon.types';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/profile.module.css';

type NamedColor = keyof typeof Color;

type Contact = {
    type: "phone" | "email" | "github" | "youtube";
    link: string;
    width: number;
    height: number;
    label: string;
    value: string;
    color: NamedColor;
    icon: Icon;
}

const contacts: Array<Contact> = [
    {
        "type": "phone",
        "link": "tel:01035661857",
        "width": 186,
        "height": 28,
        "label": "call",
        "value": "01035661857",
        "color": "blue",
        "icon": "apple"
    },
    {
        "type": "email",
        "link": "mailto:ydm2790@gmail.com",
        "width": 245.25,
        "height": 28,
        "label": "mail",
        "value": "ydm2790@gmail.com",
        "color": "black",
        "icon": "gmail"
    },
    {
        "type": "github",
        "link": "https://github.com/AndrewDongminYoo",
        "width": 245.25,
        "height": 28,
        "label": "'git'",
        "value": "AndrewDongminYoo",
        "color": "lightgreen",
        "icon": "github"
    },
    {
        "type": "youtube",
        "link": "https://www.youtube.com/watch?v=vOh90eJ7VdY",
        "width": 209,
        "height": 28,
        "label": "'ytb'",
        "value": "v=vOh90eJ7VdY",
        "color": "red",
        "icon": "youtube"
    }
]

export default function ProfileBio() {
    return (
        <section className={styles.information}>
            <div className={styles.name}>
                <h1>집요하게 더 나은 답을 찾아내는 개발자 유동민입니다.</h1>
            </div>
            <ul className={styles.contacts}>
                {contacts.map((contact, i) => {
                    return <ContactBadge contact={contact} key={i} />
                })}
            </ul>
            <div className={styles.description}>
                <div>
                    <div>
                        <p>
                            좋은 개발자가 되기 위해 계속해서 성장하고자 하는
                            집요함을 가지고 있습니다. 일상적으로 만나는 모든
                            문제들에 더 효율적이고 효과적인 답을 찾기 위해
                            끊임없이 고민하고 사유합니다. 함께 성장하는 좋은
                            동료가 되기 위해 노력하겠습니다.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

const ContactBadge = ({ contact }: { contact: Contact }) => {
    const { type, link, width, height, label, value, color, icon, } = contact;
    const { href, hostname, pathname, search } = new URL(link)
    const src = `https://img.shields.io/badge/${label}-${value}-${color}?logo=${icon}&style=for-the-badge`
    return (
        <li className={type}>
            <Link href={href} target="_blank" rel="noopener">
                <Image
                    unoptimized={true}
                    width={width}
                    height={height}
                    alt={`${type}:${hostname}${pathname}${search}`}
                    src={src}
                />
            </Link>
        </li>
    )
}
