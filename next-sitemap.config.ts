import { IConfig } from 'next-sitemap';
import { IRobotsTxt } from 'next-sitemap';

const robotsTxtOptions: IRobotsTxt = {
    includeNonIndexSitemaps: true,
    policies: [{
        userAgent: '*',
        allow: [
            '/repos',
            '/',
        ],
        disallow: [
            '/_next/static/chunks/pages/posts',
            '/_next/static/chunks/pages/repos',
            '/_next/static/chunks/pages',
            '/_next/static/chunks',
            '/_next/static/media',
            '/_next/static/css',
            '/_next/static/',
            '/posts',
            '/styles',
        ],
    }]
};

const sitemapConfig: IConfig = {
    siteUrl: 'https://AndrewDongminYoo.vercel.app',
    sitemapSize: 5000,
    generateRobotsTxt: true,
    robotsTxtOptions,
};

module.exports = sitemapConfig;