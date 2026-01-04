/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const readdirSync = vi.fn();
const readFileSync = vi.fn();
const matter = vi.fn();

vi.mock('fs', () => ({
  default: {
    readdirSync,
    readFileSync,
  },
}));

vi.mock('gray-matter', () => ({
  default: matter,
}));

const base = {
  index: 0,
  title: 'title',
  name: 'name',
  startAt: '2024-01-01',
  endAt: null,
  description: 'desc',
};

const educationData = {
  ...base,
  major: 'CS',
  degree: 'BS',
};

const projectData = {
  ...base,
  startAt: '2023-01-01',
  tags: [],
  analyzedLink: 'link',
  teamDescription: 'team',
  roleDescriptions: 'role',
};

const activityData = {
  ...base,
  website_url: 'https://example.com',
};

const experienceData = {
  ...base,
  role: 'Developer',
  duration: 1,
  tags: [],
  projects: [],
};

beforeEach(() => {
  vi.resetModules();
  readdirSync.mockReset();
  readFileSync.mockReset();
  matter.mockReset();
});

describe('posts', () => {
  it('returns ids and categorized post data', async () => {
    readdirSync.mockReturnValue(['education_one.yaml', 'project_two.yaml']);
    readFileSync.mockImplementation((filePath: string) => String(filePath));
    matter.mockImplementation((content: string) => {
      if (content.includes('education_one')) return { data: educationData };
      if (content.includes('project_two')) return { data: projectData };
      return { data: educationData };
    });

    const { getAllIds, getPostData } = await import('@/lib/posts');

    expect(getAllIds()).toEqual(['education_one', 'project_two']);

    const education = getPostData('education_one');
    expect(education.type).toBe('education');
    expect(education.id).toBe('education_one');
    expect(education.title).toBe('title');
  });

  it('sorts posts by startAt descending', async () => {
    readdirSync.mockReturnValue(['education_new.yaml', 'project_old.yaml']);
    readFileSync.mockImplementation((filePath: string) => String(filePath));
    matter.mockImplementation((content: string) => {
      if (content.includes('education_new')) {
        return { data: { ...educationData, startAt: '2024-01-01' } };
      }
      if (content.includes('project_old')) {
        return { data: { ...projectData, startAt: '2023-01-01' } };
      }
      return { data: educationData };
    });

    const { getSortedPostsData } = await import('@/lib/posts');

    const sorted = getSortedPostsData();
    expect(sorted[0].id).toBe('education_new');
    expect(sorted[1].id).toBe('project_old');
  });

  it('categorizes all supported types', async () => {
    const { categorizing } = await import('@/lib/posts');

    const education = categorizing('education_demo', { data: educationData } as any);
    const activity = categorizing('activity_demo', { data: activityData } as any);
    const experience = categorizing('experience_demo', { data: experienceData } as any);
    const project = categorizing('project_demo', { data: projectData } as any);

    expect(education.type).toBe('education');
    expect(activity.type).toBe('activity');
    expect(experience.type).toBe('experience');
    expect(project.type).toBe('project');
  });
});
