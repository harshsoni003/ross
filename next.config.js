/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
<<<<<<< HEAD
  // Simplify configuration
  distDir: '.next'
=======
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
>>>>>>> c10c0025080ed35600f0c59271e3b9f33476a123
};

module.exports = nextConfig; 