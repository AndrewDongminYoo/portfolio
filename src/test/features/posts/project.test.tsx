import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactElement }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import ProjectElement from '@/features/posts/project';
import { Project } from '@/interface/profile';

const project: Project = {
  id: 'project_demo',
  type: 'project',
  index: 0,
  title: '프로젝트',
  name: '프로젝트',
  startAt: '2024-01-01',
  endAt: '2024-02-01',
  description: '설명',
  tags: ['React', 'TypeScript'],
  analyzedLink: 'link',
  teamDescription: '팀 설명',
  roleDescriptions: '역할 설명',
};

describe('ProjectElement', () => {
  it('renders tags and fallback links', () => {
    const { getByText } = render(<ProjectElement project={project} />);

    expect(getByText('React')).toBeInTheDocument();
    expect(getByText('TypeScript')).toBeInTheDocument();
    expect(getByText('https://github.com/andrewdongminyoo')).toBeInTheDocument();
    expect(getByText('https://andrewdongminyoo.vercel.app/')).toBeInTheDocument();
  });

  it('renders fallback period when start date is missing', () => {
    const projectWithoutDates: Project = {
      ...project,
      id: 'project_fallback',
      startAt: undefined,
      endAt: undefined,
    };

    const { getByText } = render(<ProjectElement project={projectWithoutDates} />);

    expect(getByText('진행 예정')).toBeInTheDocument();
  });
});
