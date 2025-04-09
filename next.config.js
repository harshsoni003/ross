/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Simplify configuration
  distDir: '.next',
  // Add this to ensure CSS is properly processed
  webpack: (config) => {
    return config;
  }
};

module.exports = nextConfig; 