// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_DIST_DIR lets a second server (e.g. dev beside a running build) use its own output folder.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // TODO: remove both once `tsc --noEmit` and `eslint` pass. These hide real
  // errors (including API routes that crash at runtime), so keep them short-lived.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**', // This will match all images from Sanity
      },
    ],
    // Optional: Add these for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // OneDrive compatibility settings
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every 1 second instead of using file system events
        aggregateTimeout: 300, // Delay before rebuilding after changes
        ignored: /node_modules/, // Don't watch node_modules
      }
    }
    return config
  },
}

module.exports = nextConfig