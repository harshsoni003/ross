#!/bin/bash
# Build script for Render deployment

# Make script executable
chmod +x render-build.sh

# Install dependencies
npm install

# Build the Next.js application with increased memory allocation
NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Exit with success
exit 0 