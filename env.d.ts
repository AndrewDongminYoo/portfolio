declare module '@/env' {
    export const NODE_ENV:      ENV;
    export const GITHUB_TOKEN:  string;
    export enum ENV {
        DEV = 'development',
        PROD = 'production',
        TEST = 'test',
    }
};