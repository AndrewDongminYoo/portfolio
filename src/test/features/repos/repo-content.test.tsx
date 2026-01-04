import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/features/repos/specs', () => ({
  isProgrammingLanguage: (name: string) => name !== 'Markdown',
}));

vi.mock('@/features/repos/simple-icons', () => ({
  getSimpleIcon: () => ({ color: '#112233' }),
}));

vi.mock('@/features/repos/repo-card', () => ({
  default: () => <div data-testid='repo-card' />,
}));

import RepoContent from '@/features/repos/repo-content';
import type Repository from '@/interface/repos';

const baseRepo: Repository = {
  node_id: '1',
  name: 'repo',
  full_name: 'owner/repo',
  private: false,
  owner: { login: 'owner', avatar_url: '' },
  html_url: 'https://example.com/repo',
  description: 'desc',
  languages_url: 'https://example.com/lang',
  pushed_at: '2024-01-01T00:00:00Z',
  size: 0,
  stargazers_count: 0,
  watchers_count: 0,
  language: 'TypeScript',
  forks_count: 0,
  languages: { TypeScript: 70, Markdown: 30 },
};

describe('RepoContent', () => {
  it('renders language breakdown for programming languages', () => {
    const { getByText, queryByText } = render(<RepoContent repository={baseRepo} />);

    expect(getByText('owner/repo')).toBeInTheDocument();
    expect(getByText('TypeScript')).toBeInTheDocument();
    expect(getByText('100.0%')).toBeInTheDocument();
    expect(queryByText('Markdown')).not.toBeInTheDocument();
  });

  it('hides language breakdown when there are no programming languages', () => {
    const repo: Repository = { ...baseRepo, languages: { Markdown: 10 } };

    const { queryByText } = render(<RepoContent repository={repo} />);

    expect(queryByText('Markdown')).not.toBeInTheDocument();
  });
});
