#!/bin/bash

echo "Building Box AI Chatbot for Production..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run tests
echo "Running tests..."
npm test -- --coverage --watchAll=false

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Aborting build."
    exit 1
fi

# Run linting
echo "�� Running linter..."
npm run lint

if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Aborting build."
    exit 1
fi

# Type check
echo "��� Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Aborting build."
    exit 1
fi

# Build production bundle
echo "�� Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "��� Build files are in the 'build' directory"
    
    # Optional: Analyze bundle size
    echo "��� Analyzing bundle size..."
    npm run analyze
else
    echo "❌ Build failed."
    exit 1
fi
