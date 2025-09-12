#!/bin/bash

echo "🏥 Setting up Healthcare Monorepo..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup server
echo "🖥️  Setting up Node.js server..."
cd apps/server
npm install
echo "✅ Server dependencies installed"

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from template - please update with your Supabase credentials"
fi

cd ../..

# Setup web app
echo "🌐 Setting up web application..."
cd apps/web
if [ -f package.json ]; then
    npm install
    echo "✅ Web app dependencies installed"
else
    echo "⏭️  Web app package.json not found, skipping"
fi

cd ../..

# Mobile app setup is handled separately (React Native, Flutter, etc.)
echo "📱 Mobile app directory ready for your chosen framework"

echo ""
echo "🎉 Healthcare Monorepo setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env files in apps/server and apps/mobile with your Supabase credentials"
echo "2. Run the database schema in your Supabase project (apps/server/database/schema.sql)"
echo "3. Start development with: npm run dev"
echo ""
echo "🚀 Available commands:"
echo "  npm run dev          - Start both server and web app"
echo "  npm run dev:server   - Start only the server"
echo "  npm run dev:web      - Start only the web app"
echo "  npm run build        - Build web app for production"
echo "  npm run lint         - Lint all projects"
echo ""
echo "📚 Check the README files in each app directory for more details!"
