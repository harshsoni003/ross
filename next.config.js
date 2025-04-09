/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Simplify configuration
  distDir: '.next'
};

module.exports = nextConfig; 