#!/bin/bash

echo "Deploying Box AI Chatbot..."

# Build the project
./scripts/build.sh

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting deployment."
    exit 1
fi

# Deploy to your hosting service
# Example for different services:

# For Netlify
# npx netlify deploy --prod --dir=build

# For Vercel
# npx vercel --prod

# For AWS S3
# aws s3 sync build/ s3://your-bucket-name --delete

# For custom server
# rsync -avz build/ user@server:/var/www/html/

echo "✅ Deployment completed!"
