import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ResumeSection from '@/components/section';

describe('ResumeSection', () => {
  it('renders subtitle and children', () => {
    const { getByRole, getByText } = render(
      <ResumeSection type='projects'>
        <div>콘텐츠</div>
      </ResumeSection>,
    );

    expect(getByRole('heading', { name: '개인/팀 프로젝트' })).toBeInTheDocument();
    expect(getByText('콘텐츠')).toBeInTheDocument();
  });
});
