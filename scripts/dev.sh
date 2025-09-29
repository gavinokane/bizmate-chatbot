#!/bin/bash

echo "Starting Box AI Chatbot Development Server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "��� Installing dependencies..."
    npm install
fi

# Check environment file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating default..."
    cp .env.example .env
fi

# Run type check
echo "��� Running type check..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ Type check passed"
    echo "��� Starting development server on http://localhost:3000"
    npm start
else
    echo "❌ Type check failed. Please fix errors before starting."
    exit 1
fi
