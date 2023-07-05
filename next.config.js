const isDevelopment = process.env.NODE_ENV === 'development'
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        dirs: ['components', 'constants', 'lib', 'pages']
    },
    optimizeFonts: true,
    productionBrowserSourceMaps: true,
    swcMinify: true,
    reactStrictMode: true,
    compiler: {
        removeConsole: !isDevelopment
    },
    output: 'standalone',
    outputFileTracing: true,
    cleanDistDir: true,
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
