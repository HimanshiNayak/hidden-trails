/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for Docker deployment
    output: 'standalone',

    // Expose env vars to client side
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    },

    // Allow loading images from external sources
    images: {
        remotePatterns: [
            // Google Places photo API
            {
                protocol: 'https',
                hostname: 'maps.googleapis.com',
                pathname: '/maps/api/place/photo**',
            },
            // Google Maps CDN (lh*.googleusercontent.com)
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            },
            // OpenTripMap images
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: '*.wiki.org',
            },
            // Unsplash (for any placeholder images)
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },

    // Suppress ESLint during build (lint separately)
    eslint: {
        ignoreDuringBuilds: false,
    },
};

module.exports = nextConfig;
