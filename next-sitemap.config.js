/**
 * @type {import('next-sitemap').IRobotsTxt}
 */
const robotsTxtOptions = {
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

/**
 * @type {import('next-sitemap').IConfig}
 */
const sitemapConfig = {
    siteUrl: 'https://AndrewDongminYoo.vercel.app',
    sitemapSize: 5000,
    generateRobotsTxt: true,
    robotsTxtOptions,
};

module.exports = sitemapConfig;