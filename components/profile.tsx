import { contacts, description, siteTitle } from '@data/constants';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@styles/profile.module.css';

const ProfileBio = () => {
    return (
        <section className={styles.information}>
            <h2 className={styles.name}>{siteTitle}</h2>
            <ul className={styles.contacts}>
                {contacts.map((contact, i) => {
                    return (
                        <ContactBadge contact={contact} key={i} />
                    );
                })}
            </ul>
            <p className={styles.description}>{description}</p>
        </section>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ContactBadge = ({ contact }: { contact: { type: string; link: string; image: any; } }) => {
    const { type, link, image } = contact
    const { href, hostname, pathname, search } = new URL(link);
    return (
        <li className={type}>
            <Link href={href} target="_blank" rel="noopener">
                <Image
                    alt={`${type}:${hostname}${pathname}${search}`}
                    src={image}
                    width="0"
                    height="0"
                    style={{
                        aspectRatio: 'auto',
                        width: 'auto',
                        height: 'auto',
                    }}
                />
            </Link>
        </li>
    );
};

export default ProfileBio;