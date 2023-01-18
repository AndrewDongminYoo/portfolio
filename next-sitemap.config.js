/**
 * @type {import('next-sitemap').IConfig}
 * @property {string} siteUrl
 * @property {number} sitemapSize
 * @property {boolean} generateRobotsTxt
 * @property {import('next-sitemap').IRobotPolicy} robotsTxtOptions
 */
module.exports = {
    siteUrl: 'https://AndrewDongminYoo.github.io',
    sitemapSize: 5000,
    generateRobotsTxt: true,
    robotsTxtOptions: {
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
                '/repos',
            ],
        }]
    },

}