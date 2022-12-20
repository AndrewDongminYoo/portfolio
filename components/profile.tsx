import { contacts, description, siteTitle } from '../data/constants';
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

export default function ProfileBio() {
    return (
        <section className={styles.information}>
            <div className={styles.name}>
                <h1>{siteTitle}</h1>
            </div>
            <ul className={styles.contacts}>
                {contacts.map((contact, i) => {
                    return <ContactBadge contact={contact as Contact} key={i} />
                })}
            </ul>
            <div className={styles.description}>
                <p>
                    {description}
                </p>
            </div>
        </section>
    );
}

const ContactBadge = ({ contact }: { contact: Contact }) => {
    const { type, link, width, height, label, value, color, icon, } = contact;
    const { href, hostname, pathname, search } = new URL(link)
    const src = `https://img.shields.io/badge/${label}-${value}-${color}?logo=${icon}&style=for-the-badge`
    const alt = `${type}:${hostname}${pathname}${search}`;
    const unoptimized = true
    return (
        <li className={type}>
            <Link href={href} target="_blank" rel="noopener">
                <Image
                    {...{ width, height, alt, src, unoptimized }}
                />
            </Link>
        </li>
    )
}
