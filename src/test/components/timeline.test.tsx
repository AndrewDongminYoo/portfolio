import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Experience } from '@/interface/profile';

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='tooltip'>{children}</div>
  ),
  TooltipTrigger: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid='tooltip-trigger' {...props}>
      {children}
    </div>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='tooltip-content'>{children}</div>
  ),
}));

vi.mock('@/components/period', () => ({
  default: ({ startAt, endAt }: { startAt: string; endAt: string }) => (
    <span>{`Period:${startAt}-${endAt}`}</span>
  ),
}));

import GridTimeline from '@/components/timeline';

const makeExperience = (overrides: Partial<Experience>): Experience => ({
  id: 'exp-1',
  type: 'experience',
  index: 0,
  title: 'Experience',
  name: 'Experience',
  startAt: '2023-01-01',
  endAt: '2023-03-01',
  description: 'desc',
  role: 'Dev',
  duration: 1,
  tags: [],
  projects: [],
  ...overrides,
});

describe('GridTimeline', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders timeline blocks and tooltip periods', () => {
    const timeline: Experience[] = [
      makeExperience({
        id: 'one',
        name: 'Project A',
        startAt: '2023-01-01',
        endAt: '2023-02-15',
      }),
      makeExperience({
        id: 'two',
        name: 'Project B',
        startAt: '2024-02-01',
        endAt: null,
      }),
    ];

    render(<GridTimeline timeline={timeline} />);

    const first = screen.getByText('Project A');
    const second = screen.getByText('Project B');

    expect(first.getAttribute('style')).toMatch(/grid-column:/);
    expect(second.getAttribute('style')).toMatch(/grid-column:/);

    expect(screen.getByText('Period:2023-01-01-2023-02-15')).toBeInTheDocument();
    expect(screen.getByText('Period:2024-02-01-2024-06-15')).toBeInTheDocument();
  });
});
