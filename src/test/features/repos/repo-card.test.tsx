import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock('@/features/repos/copy-to-clipboard', () => ({
  CopyToClipboard: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <div data-testid='copy' data-value={value}>
      {children}
    </div>
  ),
}));

vi.mock('@/features/repos/simple-icons', () => ({
  getSimpleIcon: () => ({ color: '#112233', url: 'https://example.com/icon.svg' }),
}));

import RepoCard from '@/features/repos/repo-card';
import type Repository from '@/interface/repos';
import { username } from '@/lib/constants';

const repo: Repository = {
  node_id: '1',
  name: 'repo',
  full_name: 'owner/repo',
  private: false,
  owner: { login: 'owner', avatar_url: 'https://example.com/avatar.png' },
  html_url: 'https://example.com/repo',
  description: 'desc',
  languages_url: 'https://example.com/lang',
  pushed_at: '2024-01-01T00:00:00Z',
  size: 0,
  stargazers_count: 12,
  watchers_count: 5,
  language: 'TypeScript',
  forks_count: 2,
  languages: {},
};

describe('RepoCard', () => {
  it('renders repository metadata and links', () => {
    const { getByText, getByTestId, getByRole } = render(<RepoCard repository={repo} />);

    expect(getByText('owner/')).toBeInTheDocument();
    expect(getByText('repo')).toBeInTheDocument();
    expect(getByText('desc')).toBeInTheDocument();

    const copy = getByTestId('copy');
    expect(copy.getAttribute('data-value')).toBe(`${repo.html_url}.git`);

    const languageLink = getByRole('link', { name: /TypeScript/ });
    expect(languageLink.getAttribute('href')).toContain(`user%3A${username}`);

    expect(getByText('12')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });
});
