import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const mockConstants = vi.hoisted(() => ({
  contacts: [
    {
      type: 'email',
      link: 'https://example.com/contact?foo=bar',
      image: '/email.png',
    },
    {
      type: 'github',
      link: 'https://github.com/example',
      image: '/github.png',
    },
  ],
  description: 'First line\nSecond line',
  primaryTitle: 'Primary Title',
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

vi.mock('@/lib/constants', () => ({
  contacts: mockConstants.contacts,
  description: mockConstants.description,
  primaryTitle: mockConstants.primaryTitle,
}));

import ProfileBio from '@/components/layout/profile';

describe('ProfileBio', () => {
  it('renders the primary title and contact badges', () => {
    render(<ProfileBio />);

    expect(screen.getByText(mockConstants.primaryTitle)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(mockConstants.contacts.length);

    const [firstLink] = screen.getAllByRole('link');
    expect(firstLink).toHaveAttribute('href', mockConstants.contacts[0].link);

    const [firstImage] = screen.getAllByRole('img');
    expect(firstImage).toHaveAttribute('alt', 'email:example.com/contact?foo=bar');
  });

  it('renders each description paragraph on its own line', () => {
    render(<ProfileBio />);

    expect(screen.getByText('First line')).toBeInTheDocument();
    expect(screen.getByText('Second line')).toBeInTheDocument();
  });
});
