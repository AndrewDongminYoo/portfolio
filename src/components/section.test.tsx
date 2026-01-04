import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ResumeSection from '@/components/section';

describe('ResumeSection', () => {
  it('renders subtitle and children', () => {
    render(
      <ResumeSection type='projects'>
        <div>콘텐츠</div>
      </ResumeSection>,
    );

    expect(screen.getByRole('heading', { name: '개인/팀 프로젝트' })).toBeInTheDocument();
    expect(screen.getByText('콘텐츠')).toBeInTheDocument();
  });
});
