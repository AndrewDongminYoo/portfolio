/**
 * @type {import('next-sitemap').IRobotsTxt}
 */
const robotsTxtOptions = {
  includeNonIndexSitemaps: false,
  policies: [
    {
      userAgent: '*',
      allow: ['/repos', '/'],
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
    },
  ],
};

/**
 * @type {import('next-sitemap').IConfig}
 */
const sitemapConfig = {
  siteUrl: 'https://AndrewDongminYoo.vercel.app',
  generateIndexSitemap: false,
  generateRobotsTxt: true,
  output: 'standalone',
  robotsTxtOptions,
};

module.exports = sitemapConfig;
