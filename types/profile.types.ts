export type Resume = Experience | Project | Education | Activity;

export interface Experience {
    type: 'experience';
    id?: string;
    index: number;
    title: string;
    name: string;
    role: string;
    startAt: DateString;
    endAt: DateString | null;
    website_url?: URLLike;
    duration: number;
    tags: Tag[];
    icon?: Emoji;
    projects: Project[];
    link?: URLLike;
    description: Description;
}

export interface Project {
    type: 'project';
    id?: string;
    title: string;
    startAt: DateString;
    endAt: DateString | null;
    repository?: URLLike;
    website_url?: URLLike;
    icon?: Emoji;
    index: number;
    name: string;
    tags: Tag[];
    analyzedLink: URLLike;
    teamDescription: Description;
    description: Description;
    roleDescriptions: Description;
}

export interface Education {
    type: 'education';
    id?: string;
    index: number;
    title: string;
    name: string;
    major: string;
    degree: string;
    icon?: Emoji;
    description: Description;
    startAt: DateString;
    endAt: DateString | null;
}

export interface Activity {
    type: 'activity';
    id?: string;
    index: number;
    title: string;
    startAt: DateString;
    endAt: DateString | null;
    link: URLLike;
    icon?: Emoji;
    description: Description;
}

type URLLike = string;
type DateString = string;
type Description = string | string[];
type Emoji = string;
type Tag = "Swagger" | "styled-components" | "Prisma" | "AWS CloudFront" | "AWS RDS" | "AWS Lambda" | "Django" | "Firebase" | "Flask" | "GitHub" | "GraphQL" | "Java" | "MongoDB" | "MySQL" | "Python" | "React Native" | "ReactJS" | "Selenium" | "Spring Boot" | "TypeScript" | "Webpack" | "flutter" | "AWS Elastic Beanstalk" | "AWS ElasticBeanstalk" | "Spring Data JPA" | "WebSocket" | "Spring Security" | "Chart.js" | "Storybook" | "BeautifulSoup" | "Expo";