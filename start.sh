#!/bin/bash
# Start script for Render deployment

# Check if standalone server exists
if [ -f ".next/standalone/server.js" ]; then
  echo "Starting standalone server..."
  node .next/standalone/server.js
else
  echo "Standalone server not found, falling back to npm start..."
  npm start
fi 