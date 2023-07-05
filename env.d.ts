declare module '@/env' {
    readonly export const NODE_ENV: 'development' | 'production' | 'test';
    readonly export const GITHUB_TOKEN: string;
    readonly export const NEXT_PUBLIC_AUTH0_DOMAIN: string;
    readonly export const NEXT_PUBLIC_AUTH0_CLIENT_ID: string;
    readonly export const NEXT_PUBLIC_AUTH0_ADMIN_EMAIL: string;
    readonly export const NEXT_PUBLIC_BASE_URL: string;
    readonly export const REDIS_URL: string;
    readonly export const OPENAI_ORGANIZATION: string;
    readonly export const OPENAI_API_KEY: string;
}
