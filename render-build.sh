#!/bin/bash
# Build script for Render deployment

# Make the script executable
chmod +x render-build.sh

# Install dependencies
npm install

# Fix potential npm vulnerabilities (non-breaking)
npm audit fix --production

# Install SWC dependencies that might be missing
npm install @swc/core @swc/helpers

# Build the Next.js application with increased memory allocation
NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Copy server.js to the standalone directory
cp server.js .next/standalone/

# Copy the public directory to the standalone output
mkdir -p .next/standalone/public
cp -r public/* .next/standalone/public/

# Exit with success
exit 0 