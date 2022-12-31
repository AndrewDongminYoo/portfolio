/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? '',
    },
    productionBrowserSourceMaps: true,
    crossOrigin: "use-credentials",
    reactStrictMode: true,
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
        path: "https://andrewdongminyoo.imgix.net/",
        loader: "imgix",
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        unoptimized: true,
    },
}

module.exports = nextConfig
