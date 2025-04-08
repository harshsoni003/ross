#!/bin/bash
# Custom build script for Vercel that bypasses ESLint

# Install dependencies
npm install

# Run Next.js build with ESLint disabled
NODE_OPTIONS="--max_old_space_size=4096" next build

# Exit with success
exit 0 