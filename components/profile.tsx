import { description, siteTitle } from '@data/constants';
import Color from 'color-name';
import Icon from '@typings/slug-icon';
import Image from 'next/image';
import Link from 'next/link';
import contacts from '@data/contacts.json';
import styles from '@styles/profile.module.css';

type NamedColor = keyof typeof Color;

type Contact = {
    type: 'phone' | 'email' | 'github' | 'youtube';
    link: string;
    label: string;
    value: string;
    color: NamedColor;
    icon: Icon;
};

const ProfileBio = () => {
    return (
        <section className={styles.information}>
            <h1 className={styles.name}>{siteTitle}</h1>
            <ul className={styles.contacts}>
                {contacts.map((contact, i) => {
                    return (
                        <ContactBadge contact={contact as Contact} key={i} />
                    );
                })}
            </ul>
            <p className={styles.description}>{description}</p>
        </section>
    );
};

const ContactBadge = ({ contact }: { contact: Contact }) => {
    const { type, link, label, value, color, icon } = contact;
    const { href, hostname, pathname, search } = new URL(link);
    const src = `https://img.shields.io/badge/${label}-${value}-${color}?logo=${icon}&style=for-the-badge`;
    const alt = `${type}:${hostname}${pathname}${search}`;
    const unoptimized = true;
    const style = { aspectRatio: 'auto', width: 'auto', height: 'auto' };
    return (
        <li className={type}>
            <Link href={href} target="_blank" rel="noopener">
                <Image {...{ style, alt, src, unoptimized, width: '0', height: '0' }} />
            </Link>
        </li>
    );
};

export default ProfileBio;