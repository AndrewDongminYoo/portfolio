/* eslint-disable-next-line @typescript-eslint/no-var-requires */
// const nextTranslate = require('next-translate-plugin');
const isDevelopment = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        dirs: ['components', 'constants', 'lib', 'pages']
    },
    /** By default, Next.js will automatically inline font CSS at build time */
    optimizeFonts: true,
    /** Enable browser source map generation during the production build */
    productionBrowserSourceMaps: true,
    /** Use SWC compiler to minify the generated JavaScript */
    swcMinify: true,
    /** The Next.js runtime is Strict Mode-compliant. */
    reactStrictMode: true,
    compiler: {
        removeConsole: !isDevelopment
    },
    output: 'standalone',
    outputFileTracing: true,
    /** The build output directory (defaults to .next) is now cleared by default except for the Next.js caches. */
    cleanDistDir: true,
    i18n: {
        /** These are all the locales you want to support in your application */
        locales: ['ko', 'en-US'],
        /** This is the default locale you want to be used when visiting a non-locale prefixed path e.g. `/hello` */
        defaultLocale: 'ko',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "avatars.githubusercontent.com",
                pathname: "/u/**",
            },
            {
                protocol: 'https',
                hostname: "*.githubassets.com",
            }, {
                protocol: 'https',
                hostname: "AndrewDongminYoo.vercel.app",
            }
        ],
        dangerouslyAllowSVG: true,
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 60,
        disableStaticImages: false,
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        unoptimized: false,
    },
    /** Headers allow you to set custom HTTP headers for an incoming request path. */
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=10, stale-while-revalidate=59', // Matched parameters can be used in the value
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'sec-fetch-site',
                        value: 'same-origin',
                    },
                    {
                        key: 'Referer',
                        value: 'https://AndrewDongminYoo.vercel.app'
                    }
                ]
            }
        ]
    },
}

module.exports = nextConfig
