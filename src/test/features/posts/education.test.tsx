import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import EducationElement from '@/features/posts/education';
import { Education } from '@/interface/profile';

const education: Education = {
  id: 'education_demo',
  type: 'education',
  index: 0,
  title: '컴퓨터공학',
  name: '학교',
  startAt: '2024-01-01',
  endAt: '2025-01-01',
  description: '설명',
  major: '컴퓨터공학',
  degree: '학사',
};

describe('EducationElement', () => {
  it('renders title and degree info', () => {
    const { getByText } = render(<EducationElement education={education} />);

    expect(getByText('컴퓨터공학')).toBeInTheDocument();
    expect(getByText('컴퓨터공학 전공')).toBeInTheDocument();
    expect(getByText('• 학사')).toBeInTheDocument();
  });

  it('renders fallback period when start date is missing', () => {
    const educationWithoutDates: Education = {
      ...education,
      id: 'education_fallback',
      startAt: undefined,
      endAt: undefined,
    };

    const { getByText } = render(<EducationElement education={educationWithoutDates} />);

    expect(getByText('입학 예정')).toBeInTheDocument();
  });
});
