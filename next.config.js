/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Ensure all assets are copied to the standalone output
  experimental: {
    outputFileTracingRoot: process.cwd(),
    outputFileTracingIncludes: {
      '/**': ['./public/**/*']
    }
  },
  // Explicitly configure static assets
  assetPrefix: '',
  // Ensure CSS is properly processed
  webpack: (config) => {
    return config;
  }
};

module.exports = nextConfig; 