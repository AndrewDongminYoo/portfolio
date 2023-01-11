/* eslint-disable @typescript-eslint/no-explicit-any */
import { contacts, description, primaryTitle } from '@constants';
import Image from 'next/image';
import Link from 'next/link';
import names from 'classnames';

export default function ProfileBio() {
    return (
        <section className="p-0 mt-0 text-base border-t-0 text-slate-800">
            <h2
                className={names(
                    'flex flex-row flex-nowrap items-center justify-between',
                    '-ml-px mb-4 break-keep leading-snug text-2xl min-h-16'
                )}
            >
                {primaryTitle}
            </h2>
            <ul className="p-0 my-0 list-none">
                {contacts.map((contact, i) => {
                    return <ContactBadge contact={contact} key={i} />;
                })}
            </ul>
            <p className="mt-4 text-base leading-6">
                {description}
            </p>
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
        <li
            className={names(
                'flex flex-row flex-nowrap items-center justify-start leading-relaxed',
                'font-normal text-sm tracking-normal'
            )}
        >
            <Link
                className={names(
                    'inline pb-1 tracking-normal leading-relaxed',
                    'truncate font-normal text-sm'
                )}
                href={href}
                target="_blank"
                rel="noopener"
            >
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
