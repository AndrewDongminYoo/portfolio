/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        forceSwcTransforms: true,
        urlImports: ['https://connect.facebook.net/']
    },
    images: {
        domains: [
            "external-ssn1-1.xx.fbcdn.net",
            "opengraph.githubassets.com"
        ]
    }
}

module.exports = nextConfig
