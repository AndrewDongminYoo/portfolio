import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import StackList from '@/components/layout/stacks';
import { stacks } from '@/lib/constants';

describe('StackList', () => {
  it('renders primary and technical stacks with counts', () => {
    render(<StackList />);

    expect(screen.getByText('주요 기술')).toBeInTheDocument();
    expect(screen.getByText(`${stacks.primaryTags.length}개`)).toBeInTheDocument();

    stacks.primaryTags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    });

    expect(screen.getByText('기술 태그')).toBeInTheDocument();
    stacks.technicalTags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    });
  });
});
