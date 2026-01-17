// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
  publicRuntimeConfig: {
    apiBase: process.env.NEXT_PUBLIC_API_BASE,
    appName: process.env.NEXT_PUBLIC_APP_NAME,
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  reactStrictMode: true,
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/dh2cpesxu/**',
    },
    {
      protocol: 'http',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/dh2cpesxu/**',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'source.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'www.istockphoto.com',
    },
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
    {
      protocol: 'https',
      hostname: 'example.com',
    }
  ],
  qualities: [75, 85],
},
};

module.exports = nextConfig;