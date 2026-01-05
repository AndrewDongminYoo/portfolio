import { render } from '@testing-library/react';
import type { SVGProps } from 'react';
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

vi.mock('lucide-react', () => ({
  Code: (props: SVGProps<SVGSVGElement>) => <svg data-testid='code' {...props} />,
  Eye: (props: SVGProps<SVGSVGElement>) => <svg data-testid='eye' {...props} />,
  GitFork: (props: SVGProps<SVGSVGElement>) => <svg data-testid='fork' {...props} />,
  Lock: (props: SVGProps<SVGSVGElement>) => <svg data-testid='lock' {...props} />,
  LockOpen: (props: SVGProps<SVGSVGElement>) => <svg data-testid='lock-open' {...props} />,
  Star: (props: SVGProps<SVGSVGElement>) => <svg data-testid='star' {...props} />,
}));

vi.mock('@/features/repos/copy-to-clipboard', () => ({
  CopyToClipboard: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <div data-testid='copy' data-value={value}>
      {children}
    </div>
  ),
}));

const iconState = vi.hoisted(() => ({
  icon: { color: '#112233', url: 'https://example.com/icon.svg' },
}));

vi.mock('@/features/repos/simple-icons', () => ({
  getSimpleIcon: () => iconState.icon,
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
    iconState.icon = { color: '#112233', url: 'https://example.com/icon.svg' };
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
    expect(getByTestId('lock-open')).toBeInTheDocument();
  });

  it('renders lock icon and fallback icon style when repository is private', () => {
    iconState.icon = { color: '#445566', url: '' };

    const privateRepo: Repository = { ...repo, private: true };
    const { container, getByTestId, queryByTestId } = render(<RepoCard repository={privateRepo} />);

    expect(getByTestId('lock')).toBeInTheDocument();
    expect(queryByTestId('lock-open')).toBeNull();

    const swatch = container.querySelector('span[aria-hidden="true"]');
    expect(swatch).toHaveStyle({ backgroundColor: '#445566' });
    expect(swatch?.getAttribute('style')).not.toContain('mask-image');
  });
});
