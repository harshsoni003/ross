#!/bin/bash
# Build script for Render deployment

# Make the script executable
chmod +x render-build.sh

# Install dependencies
npm install

# Fix potential npm vulnerabilities (non-breaking)
npm audit fix --production

# Build the Next.js application with increased memory allocation
NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Exit with success
exit 0 