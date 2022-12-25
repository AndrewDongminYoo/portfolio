/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
        domains: [
            "*.githubassets.com",
            "opengraph.githubassets.com",
            "*.githubusercontent.com",
            "repository-images.githubusercontent.com",
        ],
    },
}

module.exports = nextConfig
