import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const getSimpleIcon = vi.fn();

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('@/features/repos/simple-icons', () => ({
  getSimpleIcon: (language: string) => getSimpleIcon(language),
}));

import LanguageButton from '@/features/repos/lang-btn';

describe('LanguageButton', () => {
  it('links to my repositories for the top language', () => {
    getSimpleIcon.mockReturnValue({ color: '#123456' });

    const { container } = render(
      <LanguageButton language='TypeScript' percent={12.34} index={0} />,
    );

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://github.com/AndrewDongminYoo?tab=repositories&language=TypeScript',
    );
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('12.3%')).toBeInTheDocument();

    const swatch = container.querySelector('span[aria-hidden="true"]');
    expect(swatch).toHaveStyle({ backgroundColor: '#123456' });
  });

  it('links to GitHub topics for non-primary languages', () => {
    getSimpleIcon.mockReturnValue({ color: '#999999' });

    render(<LanguageButton language='Go' percent={1} index={2} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/topics/Go');
  });

  it('falls back to default color when icon is missing', () => {
    getSimpleIcon.mockReturnValue(undefined);

    const { container } = render(<LanguageButton language='Rust' percent={3.21} index={0} />);

    const swatch = container.querySelector('span[aria-hidden="true"]');
    expect(swatch).toHaveStyle({ backgroundColor: '#999999' });
  });
});
