import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Simplify configuration
  distDir: '.next'
};

export default nextConfig;
