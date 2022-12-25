/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        forceSwcTransforms: true
    },
    images: {
        domains: [
            "githubassets.com",
            "githubusercontent.com"
        ]
    }
}

module.exports = nextConfig
