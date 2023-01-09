/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? '',
    },
    optimizeFonts: true,
    productionBrowserSourceMaps: true,
    swcMinify: true,
    reactStrictMode: true,
    compiler: {
        removeConsole: { exclude: ['error', 'debug'] }
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.githubassets.com",
            },
            {
                protocol: "https",
                hostname: "**.githubusercontent.com",
            },
        ],
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        dangerouslyAllowSVG: true,
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 60,
        disableStaticImages: false,
        // path: "https://andrewdongminyoo.imgix.net/",
        // loader: "imgix",
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        unoptimized: false,
    },
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
                        key: 'sec-fetch-mode',
                        value: 'no-cors',
                    },
                    {
                        key: 'sec-fetch-site',
                        value: 'same-origin',
                    },
                    {
                        key: 'Referer',
                        value: 'https://AndrewDongminYoo.github.io'
                    }
                ]
            }
        ]
    },
}

module.exports = nextConfig
