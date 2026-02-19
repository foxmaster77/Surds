@echo off
REM Production Deployment Script for Frontend (Windows)
REM Usage: deploy.bat

setlocal enabledelayedexpansion

echo 🚀 Starting Frontend Deployment...

REM Check if .env.production exists
if not exist .env.production (
    echo ❌ Error: .env.production not found
    echo Please create .env.production file with production environment variables
    exit /b 1
)

echo 1️⃣ Checking Node.js version...
call node --version

echo 2️⃣ Installing dependencies...
call npm ci

echo 3️⃣ Running linter...
call npm run lint
if errorlevel 1 (
    echo ⚠️ Linting issues found
)

echo 4️⃣ Building production bundle...
call npm run build

echo 5️⃣ Checking build artifacts...
if exist dist (
    echo Build directory size:
    for /r dist %%A in (*) do (
        @echo %%~zA bytes - %%A
    )
)

echo 6️⃣ Creating deployment package...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
if not exist backups mkdir backups
7z a -r backups\linkforge-frontend-%mydate%-%mytime%.7z dist\

echo ✅ Frontend deployment preparation complete!
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Vercel will auto-deploy from GitHub
echo 3. Monitor deployment at Vercel dashboard
echo 4. Access at: https://your-frontend.vercel.app
echo.
echo Tips:
echo • Check dist/ folder size (should be less than 1MB gzipped)
echo • Verify VITE_API_URL points to production backend
echo • Test all features after deployment
echo.
