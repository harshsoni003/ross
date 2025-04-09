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
cp -r public/* .next/standalone/public/ 2>/dev/null || :

# Copy the .next/static directory to the standalone output
mkdir -p .next/standalone/.next/static
cp -r .next/static/* .next/standalone/.next/static/ 2>/dev/null || :

# Copy the entire .next directory to ensure all assets are available
cp -r .next/* .next/standalone/.next/ 2>/dev/null || :

# Create a simple startup script in the standalone directory
cat > .next/standalone/start.sh << 'EOL'
#!/bin/bash
NODE_ENV=production node server.js
EOL

chmod +x .next/standalone/start.sh

# Exit with success
exit 0 