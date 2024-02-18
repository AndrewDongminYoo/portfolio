export default Resume;

type Resume = Experience | Project | Education | Activity;

export type SectionType =
  | 'experiences'
  | 'projects'
  | 'educations'
  | 'activities'
  | 'contributions'
  | 'timeline';

type ResumeBase<type extends string> = {
  id: string;
  type: type;
  index: number;
  title: string;
  name: string;
  startAt: string;
  endAt: string | null;
  icon?: string;
  description: string | string[];
};

export type Experience = ResumeBase<'experience'> & {
  name: string;
  role: string;
  website_url?: string;
  duration: number;
  tags: string[];
  projects: Project[];
  link?: string;
};

export type Project = ResumeBase<'project'> & {
  repository?: string;
  website_url?: string;
  name: string;
  tags: string[];
  analyzedLink: string;
  teamDescription: string | string[];
  roleDescriptions: string | string[];
};

export type Education = ResumeBase<'education'> & {
  name: string;
  major: string;
  degree: string;
};

export type Activity = ResumeBase<'activity'> & {
  website_url: string;
};
