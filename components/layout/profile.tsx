import Image from 'next/image';
import Link from 'next/link';

import { contacts, description, primaryTitle } from '@/constants/';

export default function ProfileBio() {
  return (
    <section className='text-foreground mt-0 border-t-0 px-0 py-0 text-base'>
      <h2 className='mb-4 -ml-px flex min-h-16 flex-row flex-nowrap items-center justify-between text-2xl leading-snug break-keep'>
        {primaryTitle}
      </h2>
      <ul className='my-0 list-none px-0 py-0'>
        {contacts.map((contact, i) => {
          return <ContactBadge contact={contact} key={`${i}-${contact.type}`} />;
        })}
      </ul>
      <p className='mt-4 text-base leading-6'>{description}</p>
    </section>
  );
}

const ContactBadge = ({ contact }: { contact: { type: string; link: string; image: string } }) => {
  const { type, link } = contact;
  const { href, hostname, pathname, search } = new URL(link);
  return (
    <li className='flex flex-row flex-nowrap items-center justify-start text-sm leading-relaxed font-normal tracking-normal'>
      <Link
        className='inline truncate pb-1 text-sm leading-relaxed font-normal tracking-normal'
        href={href}
        target='_blank'
        rel='noopener'>
        <Image
          alt={`${type}:${hostname}${pathname}${search}`}
          src={contact.image}
          width={245.25}
          height={28}
        />
      </Link>
    </li>
  );
};
