export type Resume = Experience | Project | Education | Activity;

type ResumeBase = {
    id: string;
    type: string;
    index: number;
    title: string;
    name: string;
    startAt: DateString;
    endAt: DateString | null;
    icon?: Emoji;
    description: Description;
}

export type Experience = ResumeBase & {
    type: 'experience';
    name: string;
    role: string;
    website_url?: URLLike;
    duration: number;
    tags: Tag[];
    projects: Project[];
    link?: URLLike;
}

export type Project = ResumeBase & {
    type: 'project';
    repository?: URLLike;
    website_url?: URLLike;
    name: string;
    tags: Tag[];
    analyzedLink: URLLike;
    teamDescription: Description;
    roleDescriptions: Description;
}

export type Education = ResumeBase & {
    type: 'education';
    name: string;
    major: string;
    degree: string;
}

export type Activity = ResumeBase & {
    type: 'activity';
    website_url: URLLike;
}

type URLLike = string;
type DateString = string;
type Description = string | string[];
type Emoji = string;
type Tag =
    | 'Swagger'
    | 'styled-components'
    | 'Prisma'
    | 'AWS CloudFront'
    | 'AWS RDS'
    | 'AWS Lambda'
    | 'Django'
    | 'Firebase'
    | 'Flask'
    | 'GitHub'
    | 'GraphQL'
    | 'Java'
    | 'MongoDB'
    | 'MySQL'
    | 'Python'
    | 'React Native'
    | 'ReactJS'
    | 'Selenium'
    | 'Spring Boot'
    | 'TypeScript'
    | 'Webpack'
    | 'flutter'
    | 'AWS Elastic Beanstalk'
    | 'AWS ElasticBeanstalk'
    | 'Spring Data JPA'
    | 'WebSocket'
    | 'Spring Security'
    | 'Chart.js'
    | 'Storybook'
    | 'BeautifulSoup'
    | 'Expo';
