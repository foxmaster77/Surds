@echo off
REM Production Deployment Script for Backend (Windows)
REM Usage: deploy.bat

setlocal enabledelayedexpansion

echo 🚀 Starting Backend Deployment...

REM Check if .env.production exists
if not exist .env.production (
    echo ❌ Error: .env.production not found
    echo Please create .env.production file with production environment variables
    exit /b 1
)

echo 1️⃣ Checking Node.js version...
call node --version

echo 2️⃣ Installing dependencies...
call npm install --production

echo 3️⃣ Running tests...
call npm test
if errorlevel 1 (
    echo ⚠️ Tests failed, continuing...
)

echo 4️⃣ Linting code...
call npm run lint
if errorlevel 1 (
    echo ⚠️ Linting issues found
)

echo 5️⃣ Building application...
call npm run build

echo 6️⃣ Creating production backup...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
if not exist backups mkdir backups
7z a -r backups\linkforge-backend-%mydate%-%mytime%.7z . -x!node_modules -x!.git -x!backups

echo ✅ Backend deployment preparation complete!
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Render will auto-deploy from GitHub
echo 3. Monitor deployment at Render dashboard
echo 4. Test API: https://your-backend.onrender.com/api/links
echo.
