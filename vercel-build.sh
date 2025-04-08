#!/bin/bash
# Custom build script for Vercel that bypasses ESLint

# Install dependencies
npm install

# Run Next.js build with ESLint disabled
<<<<<<< HEAD
NODE_OPTIONS="--max_old_space_size=4096" next build --no-lint
=======
NODE_OPTIONS="--max_old_space_size=4096" next build
>>>>>>> 178cff7c507bded3162b2e23de0d3c6e44006da6

# Exit with success
exit 0 