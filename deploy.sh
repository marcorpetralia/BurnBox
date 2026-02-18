#!/bin/bash
# Azure App Service deployment script for Next.js standalone

echo "Installing dependencies..."
npm ci --production=false

echo "Building Next.js app..."
npm run build

echo "Setting up standalone server..."
cp -r .next/standalone/* .
cp -r .next/static .next/static
cp server.js ./server.js

echo "Deployment complete."
