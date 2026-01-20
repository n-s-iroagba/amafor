import type { NextConfig } from 'next';

const nextConfig: NextConfig = {


  // Turbopack configuration - empty to suppress warning
  turbopack: {},

  // Suppress experimental warnings
  experimental: {
    // Add any experimental features here if needed
  },

  env: {
    APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },

  reactStrictMode: true, // Set to false to suppress strict mode warnings



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
        protocol: 'http',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
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
    unoptimized: false,
  },


};

export default nextConfig;