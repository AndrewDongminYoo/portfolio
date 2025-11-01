declare module 'github-calendar';
declare module '*.css';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    GITHUB_TOKEN: string;
  }
}
