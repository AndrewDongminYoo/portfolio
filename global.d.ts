interface Window {
    GitHubCalendar: (selector: string, username: string, options: object) => void;
}

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        GITHUB_TOKEN: string;
        NEXT_PUBLIC_AUTH0_DOMAIN: string;
        NEXT_PUBLIC_AUTH0_CLIENT_ID: string;
        NEXT_PUBLIC_AUTH0_ADMIN_EMAIL: string;
        NEXT_PUBLIC_BASE_URL: string;
        REDIS_URL: string;
        OPENAI_ORGANIZATION: string;
        OPENAI_API_KEY: string;
    }
}