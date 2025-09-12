@echo off
echo 🏥 Setting up Healthcare Monorepo...

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Setup server
echo 🖥️  Setting up Node.js server...
cd apps\server
call npm install
echo ✅ Server dependencies installed

REM Copy environment file
if not exist .env (
    copy .env.example .env
    echo 📝 Created .env file from template - please update with your Supabase credentials
)

cd ..\..

REM Setup web app
echo 🌐 Setting up web application...
cd apps\web
if exist package.json (
    call npm install
    echo ✅ Web app dependencies installed
) else (
    echo ⏭️  Web app package.json not found, skipping
)

cd ..\..

REM Mobile app setup is handled separately (React Native, Flutter, etc.)
echo 📱 Mobile app directory ready for your chosen framework

echo.
echo 🎉 Healthcare Monorepo setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env files in apps\server and apps\mobile with your Supabase credentials
echo 2. Run the database schema in your Supabase project (apps\server\database\schema.sql)
echo 3. Start development with: npm run dev
echo.
echo 🚀 Available commands:
echo   npm run dev          - Start both server and web app
echo   npm run dev:server   - Start only the server  
echo   npm run dev:web      - Start only the web app
echo   npm run build        - Build web app for production
echo   npm run lint         - Lint all projects
echo.
echo 📚 Check the README files in each app directory for more details!

pause
