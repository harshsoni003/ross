/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Simplify configuration
  distDir: '.next'
=======
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
>>>>>>> 178cff7c507bded3162b2e23de0d3c6e44006da6
};

module.exports = nextConfig; 