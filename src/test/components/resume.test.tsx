import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

vi.mock('lucide-react', () => ({
  Github: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid='github' {...props} />,
  Mail: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid='mail' {...props} />,
}));

vi.mock('@/lib/constants', () => ({
  myName: 'Test User',
}));

import BusinessCard from '@/components/resume';

describe('BusinessCard', () => {
  it('renders profile info and contact links', () => {
    render(<BusinessCard />);

    expect(screen.getByRole('img', { name: 'Test User' })).toHaveAttribute(
      'src',
      '/images/profile.jpg',
    );
    expect(screen.getByText('유동민')).toBeInTheDocument();
    expect(screen.getByText('Flutter Developer')).toBeInTheDocument();

    const mailLink = screen.getByRole('link', { name: /YDM2790@GMAIL.COM/ });
    expect(mailLink).toHaveAttribute('href', 'mailto:YDM2790@GMAIL.COM');

    const githubLink = screen.getByRole('link', { name: /@AndrewDongminYoo/ });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/andrewdongminyoo');
  });

  it('renders the quote section', () => {
    render(<BusinessCard />);

    expect(screen.getByText(/집요하게 더 나은 담을 찾아내는 개발자/)).toBeInTheDocument();
  });
});
