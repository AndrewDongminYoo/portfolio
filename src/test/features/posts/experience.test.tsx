import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { Experience, Project } from '@/interface/profile';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('lucide-react', () => ({
  CalendarCheck: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid='calendar' {...props} />
  ),
}));

vi.mock('@icons-pack/react-simple-icons', () => ({
  SiGithub: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid='github' {...props} />,
  SiGooglechrome: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid='chrome' {...props} />,
}));

vi.mock('@/components/period', () => ({
  default: ({ startAt, endAt }: { startAt: string; endAt: string }) => (
    <span>{`Period:${startAt}-${endAt}`}</span>
  ),
}));

vi.mock('@/features/posts/description', () => ({
  default: ({ resume }: { resume: { title?: string } }) => (
    <p>{`Desc:${resume.title ?? 'none'}`}</p>
  ),
}));

import ExperienceElement from '@/features/posts/experience';

const projectWithLinks: Project = {
  id: 'proj-1',
  type: 'project',
  index: 0,
  title: 'Project One',
  name: 'Project One',
  startAt: '2021-02-01',
  endAt: '2021-06-01',
  description: 'project desc',
  tags: ['tag'],
  analyzedLink: 'https://example.com/analyzed',
  teamDescription: 'team',
  roleDescriptions: 'role',
  website_url: 'https://example.com',
  repository: 'https://github.com/example/repo',
};

const projectPlanned = {
  id: 'proj-2',
  type: 'project',
  index: 1,
  title: 'Planned Project',
  name: 'Planned Project',
  startAt: undefined,
  endAt: undefined,
  description: 'planned desc',
  tags: [],
  analyzedLink: 'https://example.com/plan',
  teamDescription: 'team',
  roleDescriptions: 'role',
} as unknown as Project;

const experience: Experience = {
  id: 'exp-1',
  type: 'experience',
  index: 0,
  title: 'Company A',
  name: 'Company A',
  startAt: '2020-01-01',
  endAt: null,
  description: 'experience desc',
  role: 'Engineer',
  duration: 12,
  tags: ['React', 'TypeScript'],
  projects: [projectWithLinks, projectPlanned],
};

describe('ExperienceElement', () => {
  it('renders experience metadata and contributions', () => {
    render(<ExperienceElement experience={experience} />);

    expect(screen.getByText('Period:2020-01-01-재직 중')).toBeInTheDocument();

    const titleLink = screen.getByRole('link', { name: 'Company A' });
    expect(titleLink).toHaveAttribute('href', '/posts/exp-1');

    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    expect(screen.getByText('Desc:Company A')).toBeInTheDocument();
    expect(screen.getByText('상세 업무 및 성과')).toBeInTheDocument();

    const projectLink = screen.getByRole('link', { name: 'Project One' });
    expect(projectLink).toHaveAttribute('href', 'https://example.com');

    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('https://github.com/example/repo')).toBeInTheDocument();
    expect(screen.getByText('Desc:Project One')).toBeInTheDocument();

    expect(screen.getByText('Period:개발 예정-')).toBeInTheDocument();
    expect(screen.getByText('Desc:Planned Project')).toBeInTheDocument();
  });
});
