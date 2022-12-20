/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        loader: "imgix",
        path: 'https://andrewdongminyoo.imgix.net',
    }
}

module.exports = nextConfig
