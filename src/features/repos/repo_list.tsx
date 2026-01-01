'use client';

import { useMemo, useState } from 'react';

import RepoContent from '@/features/repos/repo_content';
import type Repository from '@/interface/repos';
import {
  type RepoSortMode,
  sortRepositoriesByPushedAt,
  sortRepositoriesByScoreOnly,
  sortRepositoriesDefault,
} from '@/lib/repo-sort';

const sortOptions: { value: RepoSortMode; label: string }[] = [
  { value: 'default', label: '추천' },
  { value: 'latest', label: '최신' },
  { value: 'popular', label: '인기' },
];

interface RepoListProps {
  repositories: Repository[];
}

export default function RepoList({ repositories }: RepoListProps) {
  const [sortMode, setSortMode] = useState<RepoSortMode>('default');
  const sorted = useMemo(() => {
    switch (sortMode) {
      case 'latest':
        return sortRepositoriesByPushedAt(repositories);
      case 'popular':
        return sortRepositoriesByScoreOnly(repositories);
      case 'default':
      default:
        return sortRepositoriesDefault(repositories);
    }
  }, [repositories, sortMode]);

  return (
    <section
      aria-label='repositories'
      className='mx-0 my-6 w-full rounded-lg border border-solid border-gray-300 px-6 py-6'>
      <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
        <label htmlFor='repo-sort' className='text-xs font-semibold text-gray-500'>
          정렬
        </label>
        <select
          id='repo-sort'
          value={sortMode}
          onChange={(event) => setSortMode(event.target.value as RepoSortMode)}
          className='bg-background text-foreground w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm sm:w-auto'>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {sorted.map((repo, id) => {
        return <RepoContent repository={repo} key={`${id}-${repo.node_id}`} />;
      })}
    </section>
  );
}
