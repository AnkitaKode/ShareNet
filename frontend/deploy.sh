#!/bin/bash

# ShareNet Frontend Deployment Script
set -e

echo "🚀 Starting ShareNet Frontend Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests if available
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# Build for production
echo "🔨 Building for production..."
npm run build:production

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build artifacts are in the 'dist' directory"

# Deployment options
echo ""
echo "🌐 Choose deployment option:"
echo "1. Vercel"
echo "2. Netlify"
echo "3. Docker"
echo "4. Static file hosting"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI is not installed. Install it with: npm i -g vercel"
        fi
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
        else
            echo "❌ Netlify CLI is not installed. Install it with: npm i -g netlify-cli"
        fi
        ;;
    3)
        echo "🐳 Building Docker image..."
        docker build -t sharenet-frontend .
        echo "✅ Docker image built successfully!"
        echo "Run with: docker run -p 80:80 sharenet-frontend"
        ;;
    4)
        echo "📁 Static files are ready in 'dist' directory"
        echo "Upload the contents of 'dist' to your hosting provider"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo "🎉 Deployment process completed!"
