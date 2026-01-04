import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/repos/repo-content', () => ({
  default: ({ repository }: { repository: { name: string } }) => (
    <div data-testid='repo-item'>{repository.name}</div>
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: ReactNode;
    onValueChange?: (value: string) => void;
  }) => (
    <div>
      <button type='button' onClick={() => onValueChange?.('latest')}>
        latest
      </button>
      <button type='button' onClick={() => onValueChange?.('popular')}>
        popular
      </button>
      <button type='button' onClick={() => onValueChange?.('default')}>
        default
      </button>
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectValue: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

import RepoList from '@/features/repos/repo-list';
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

    const { getAllByTestId } = render(<RepoList repositories={[lowScore, highScore]} />);

    expect(screen.getByText('정렬')).toBeInTheDocument();
    expect(screen.getByText('추천')).toBeInTheDocument();
    expect(screen.getByText('최신')).toBeInTheDocument();
    expect(screen.getByText('인기')).toBeInTheDocument();

    const items = getAllByTestId('repo-item');
    expect(items[0]).toHaveTextContent('high');
    expect(items[1]).toHaveTextContent('low');
  });

  it('updates sorting when selecting latest or popular', () => {
    const popularOld: Repository = {
      ...baseRepo,
      node_id: 'popular',
      name: 'popular',
      stargazers_count: 5,
      watchers_count: 2,
      forks_count: 1,
      pushed_at: '2023-01-01T00:00:00Z',
    };
    const recentLow: Repository = {
      ...baseRepo,
      node_id: 'recent',
      name: 'recent',
      stargazers_count: 1,
      watchers_count: 0,
      forks_count: 0,
      pushed_at: '2024-05-01T00:00:00Z',
    };

    render(<RepoList repositories={[popularOld, recentLow]} />);

    let items = screen.getAllByTestId('repo-item');
    expect(items[0]).toHaveTextContent('popular');
    expect(items[1]).toHaveTextContent('recent');

    fireEvent.click(screen.getByRole('button', { name: 'latest' }));
    items = screen.getAllByTestId('repo-item');
    expect(items[0]).toHaveTextContent('recent');
    expect(items[1]).toHaveTextContent('popular');

    fireEvent.click(screen.getByRole('button', { name: 'popular' }));
    items = screen.getAllByTestId('repo-item');
    expect(items[0]).toHaveTextContent('popular');
    expect(items[1]).toHaveTextContent('recent');
  });
});
