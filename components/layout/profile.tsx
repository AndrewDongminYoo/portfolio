/* eslint-disable @typescript-eslint/no-explicit-any */
import { contacts, description, primaryTitle } from '@/constants/';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from 'lib/utils';

export default function ProfileBio() {
  return (
    <section className='p-0 mt-0 text-base border-t-0 text-foreground'>
      <h2
        className={cn(
          'flex flex-row items-center justify-between',
          'mb-4 -ml-px text-2xl leading-snug',
          'flex-nowrap break-keep min-h-16',
        )}>
        {primaryTitle}
      </h2>
      <ul className='p-0 my-0 list-none'>
        {contacts.map((contact, i) => {
          return <ContactBadge contact={contact} key={`${i}-${contact.type}`} />;
        })}
      </ul>
      <p className='mt-4 text-base leading-6'>{description}</p>
    </section>
  );
}

const ContactBadge = ({ contact }: { contact: { type: string; link: string; image: any } }) => {
  const { type, link, image } = contact;
  const { href, hostname, pathname, search } = new URL(link);
  return (
    <li
      className={cn(
        'flex flex-row items-center justify-start',
        'text-sm font-normal leading-relaxed tracking-normal flex-nowrap',
      )}>
      <Link
        className={cn(
          'inline pb-1 text-sm font-normal',
          'leading-relaxed tracking-normal truncate',
        )}
        href={href}
        target='_blank'
        rel='noopener'>
        <Image alt={`${type}:${hostname}${pathname}${search}`} src={image} width='0' height='0' />
      </Link>
    </li>
  );
};
