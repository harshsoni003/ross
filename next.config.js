/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
    // This will disable linting during development as well
    ignoreDuringDevs: true
  },
  // Remove these two lines as they may cause issues with Vercel deployment
  // output: 'standalone',
  // distDir: '.next'
};

module.exports = nextConfig; 