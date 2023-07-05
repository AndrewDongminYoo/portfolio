declare module '@/env' {
    const NODE_ENV: 'development' | 'production' | 'test';
    const GITHUB_TOKEN: string;
    const NEXT_PUBLIC_AUTH0_DOMAIN: string;
    const NEXT_PUBLIC_AUTH0_CLIENT_ID: string;
    const NEXT_PUBLIC_AUTH0_ADMIN_EMAIL: string;
    const NEXT_PUBLIC_BASE_URL: string;
    const REDIS_URL: string;
    const OPENAI_ORGANIZATION: string;
    const OPENAI_API_KEY: string;
}
