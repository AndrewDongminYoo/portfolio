/* eslint-disable @typescript-eslint/no-explicit-any */
import { contacts, description, primaryTitle } from '@constants';
import Image from 'next/image';
import Link from 'next/link';
import names from 'classnames';
import styles from '@styles/profile.module.css';

export default function ProfileBio() {
    return (
        <section className={names(styles.information,)}>
            <h2 className={names(styles.name,)}>{primaryTitle}</h2>
            <ul className={names(styles.contacts,)}>
                {contacts.map((contact, i) => {
                    return <ContactBadge contact={contact} key={i} />;
                })}
            </ul>
            <p className={names(styles.description,)}>{description}</p>
        </section>
    );
}

const ContactBadge = ({
    contact,
}: {
    contact: { type: string; link: string; image: any };
}) => {
    const { type, link, image } = contact;
    const { href, hostname, pathname, search } = new URL(link);
    return (
        <li className={names(type,)}>
            <Link href={href} target="_blank" rel="noopener">
                <Image
                    alt={`${type}:${hostname}${pathname}${search}`}
                    src={image}
                    width="0"
                    height="0"
                />
            </Link>
        </li>
    );
};
