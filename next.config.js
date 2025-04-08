/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Ensure public assets are copied to the standalone output
  experimental: {
    outputFileTracingRoot: process.cwd(),
    outputFileTracingIncludes: {
      '/**': ['./public/**/*']
    }
  },
  // Remove distDir to use default
  // distDir: '.next'
};

module.exports = nextConfig; 