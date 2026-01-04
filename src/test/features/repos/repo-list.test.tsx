import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/repos/repo_content', () => ({
  default: ({ repository }: { repository: { name: string } }) => (
    <div data-testid='repo-item'>{repository.name}</div>
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

import RepoList from '@/features/repos/repo_list';
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
  languages: {},
};

describe('RepoList', () => {
  it('renders repositories sorted by default rules', () => {
    const highScore: Repository = {
      ...baseRepo,
      node_id: 'high',
      name: 'high',
      stargazers_count: 5,
      watchers_count: 2,
      forks_count: 1,
    };
    const lowScore: Repository = {
      ...baseRepo,
      node_id: 'low',
      name: 'low',
      stargazers_count: 1,
      watchers_count: 0,
      forks_count: 0,
      pushed_at: '2024-02-01T00:00:00Z',
    };

    const { getAllByTestId, getByText } = render(<RepoList repositories={[lowScore, highScore]} />);

    expect(getByText('정렬')).toBeInTheDocument();

    const items = getAllByTestId('repo-item');
    expect(items[0]).toHaveTextContent('high');
    expect(items[1]).toHaveTextContent('low');
  });
});
