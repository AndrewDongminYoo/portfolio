import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const getSimpleIcon = vi.fn();

vi.mock('@/features/repos/simple-icons', () => ({
  getSimpleIcon: (language: string) => getSimpleIcon(language),
}));

import LanguageStateBar from '@/features/repos/langs-bar';

describe('LanguageStateBar', () => {
  it('renders a bar part for each language with width and color', () => {
    getSimpleIcon.mockImplementation((language: string) => {
      if (language === 'TypeScript') return { color: '#111111' };
      return { color: '#222222' };
    });

    const { container } = render(
      <LanguageStateBar
        languages={[
          ['TypeScript', 60],
          ['JavaScript', 40],
        ]}
        totalCount={100}
      />,
    );

    const parts = container.querySelectorAll('span[itemprop="keywords"]');
    expect(parts).toHaveLength(2);

    expect(parts[0]).toHaveStyle({ backgroundColor: '#111111', width: '60.0%' });
    expect(parts[0]).toHaveAttribute('aria-label', 'TypeScript 60.000');

    expect(parts[1]).toHaveStyle({ backgroundColor: '#222222', width: '40.0%' });
    expect(parts[1]).toHaveAttribute('aria-label', 'JavaScript 40.000');
  });

  it('falls back to default color when icon is missing', () => {
    getSimpleIcon.mockReturnValue(undefined);

    const { container } = render(<LanguageStateBar languages={[['Rust', 50]]} totalCount={100} />);

    const part = container.querySelector('span[itemprop="keywords"]');
    expect(part).toHaveStyle({ backgroundColor: '#999999', width: '50.0%' });
    expect(part).toHaveAttribute('aria-label', 'Rust 50.000');
  });
});
