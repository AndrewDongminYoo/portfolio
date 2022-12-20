/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        loader: "imgix",
        path: 'https://andrewdongminyoo.imgix.net',
    },
    experimental: {
        forceSwcTransforms: true,
    }
}

module.exports = nextConfig
