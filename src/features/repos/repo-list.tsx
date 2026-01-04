'use client';

import { useMemo, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RepoContent from '@/features/repos/repo-content';
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
        <label id='repo-sort-label' className='text-xs font-semibold text-gray-500'>
          정렬
        </label>
        <Select value={sortMode} onValueChange={(value) => setSortMode(value as RepoSortMode)}>
          <SelectTrigger
            id='repo-sort'
            aria-labelledby='repo-sort-label'
            className='w-full sm:w-auto'>
            <SelectValue placeholder='정렬' />
          </SelectTrigger>
          <SelectContent align='end'>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {sorted.map((repo, id) => {
        return <RepoContent repository={repo} key={`${id}-${repo.node_id}`} />;
      })}
    </section>
  );
}
