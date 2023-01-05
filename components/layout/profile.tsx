/* eslint-disable @typescript-eslint/no-explicit-any */
import { contacts, description, primaryTitle } from '@constants';
import Image from 'next/image';
import Link from 'next/link';
import names from 'classnames';
import styles from '@styles/profile.module.css';

export default function ProfileBio() {
    return (
        <section className={names("mt-0 p-0 text-base")}>
            <h2 className={names("flex items-center justify-between -ml-1 mb-6 flex-row flex-no-wrap text-2xl min-h-[3rem]")}>{primaryTitle}</h2>
            <ul className={names()}>
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
        <li className="w-auto h-auto aspect-auto text-sm flex flex-row flex-no-wrap items-center justify-start font-normal">
            <Link className="text-sm text-gray-800 font-normal whitespace-no-wrap inline overflow-hidden py-0.5" href={href} target="_blank" rel="noopener">
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
