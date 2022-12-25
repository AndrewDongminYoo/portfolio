/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        forceSwcTransforms: true
    },
    images: {
        domains: [
            "opengraph.githubassets.com"
        ]
    }
}

module.exports = nextConfig
