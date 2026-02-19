@echo off
REM Production Deployment Quick Start Script (Windows)
REM This script automates the production deployment process

setlocal enabledelayedexpansion

REM Colors (Windows doesn't support ANSI by default, using text instead)
cls

echo.
echo ===============================================
echo   Production Deployment Quick Start
echo   Complete Automation Script
echo ===============================================
echo.

REM Check prerequisites
echo [*] Checking prerequisites...

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] ERROR: Git is not installed
    exit /b 1
)
echo [OK] Git is installed

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] ERROR: Node.js is not installed
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] ERROR: npm is not installed
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm version: %NPM_VERSION%

echo.
echo ===============================================
echo   Configuration Setup
echo ===============================================
echo.

set /p MONGODB_URI="Enter MongoDB Atlas URI (from .env.production): "
if "!MONGODB_URI!"=="" (
    echo [!] ERROR: MongoDB URI cannot be empty
    exit /b 1
)

set /p JWT_SECRET="Enter JWT Secret (64-char random string): "
if "!JWT_SECRET!"=="" (
    echo [!] ERROR: JWT Secret cannot be empty
    exit /b 1
)

set /p FRONTEND_URL="Enter frontend URL (e.g., https://yourdomain.com): "
if "!FRONTEND_URL!"=="" (
    echo [!] ERROR: Frontend URL cannot be empty
    exit /b 1
)

set /p BACKEND_URL="Enter Render backend URL (e.g., https://linkforge-backend.onrender.com): "
if "!BACKEND_URL!"=="" (
    echo [!] ERROR: Backend URL cannot be empty
    exit /b 1
)

REM Generate timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=!mydate!_!mytime!

echo.
echo [*] Updating backend environment variables...
if exist "backend\.env.production" (
    echo [!] Backing up existing .env.production
    copy backend\.env.production backend\.env.production.backup >nul
)

(
    echo NODE_ENV=production
    echo PORT=10000
    echo.
    echo # Database
    echo MONGODB_URI=!MONGODB_URI!
    echo.
    echo # JWT
    echo JWT_SECRET=!JWT_SECRET!
    echo JWT_EXPIRE=7d
    echo.
    echo # URLs
    echo FRONTEND_URL=!FRONTEND_URL!
    echo ALLOWED_ORIGINS=!FRONTEND_URL!
    echo.
    echo # Logging
    echo LOG_LEVEL=info
    echo LOG_DIR=./logs
    echo.
    echo # Rate Limiting
    echo RATE_LIMIT_WINDOW_MS=900000
    echo RATE_LIMIT_MAX_REQUESTS=100
    echo.
    echo # Session
    echo SESSION_SECRET=!JWT_SECRET!
    echo.
    echo # API
    echo API_BASE_URL=!BACKEND_URL!/api
) > backend\.env.production

echo [OK] Backend .env.production created

echo.
echo [*] Updating frontend environment variables...
if exist "frontend\.env.production" (
    echo [!] Backing up existing .env.production
    copy frontend\.env.production frontend\.env.production.backup >nul
)

(
    echo VITE_API_URL=!BACKEND_URL!/api
    echo VITE_APP_NAME=Link Forge
    echo VITE_APP_VERSION=1.0.0
    echo VITE_ENVIRONMENT=production
) > frontend\.env.production

echo [OK] Frontend .env.production created

echo.
echo [*] Building backend...
cd backend
call npm install --omit=dev
if %errorlevel% neq 0 (
    echo [!] WARNING: Backend npm install had issues
)
cd ..
echo [OK] Backend installed

echo.
echo [*] Building frontend...
cd frontend
call npm install --omit=dev
if %errorlevel% neq 0 (
    echo [!] ERROR: Frontend npm install failed
    cd ..
    exit /b 1
)
call npm run build
if %errorlevel% neq 0 (
    echo [!] ERROR: Frontend build failed
    cd ..
    exit /b 1
)
cd ..
echo [OK] Frontend built successfully

echo.
echo [*] Verifying builds...
if not exist "frontend\dist" (
    echo [!] ERROR: Frontend build failed - dist folder not created
    exit /b 1
)
echo [OK] Frontend build verified

echo.
echo [*] Preparing deployment packages...

REM Create backend deployment package
7z a -tzip backend-!TIMESTAMP!.zip backend ^
    -x"backend\node_modules" ^
    -x"backend\.git" ^
    -x"backend\.env" ^
    -x"backend\.env.example" >nul 2>&1

if %errorlevel% equ 0 (
    echo [OK] Backend package created: backend-!TIMESTAMP!.zip
) else (
    echo [!] WARNING: Could not create deployment packages. 7z may not be installed.
    echo [!] You can manually create archives if needed.
)

REM Create frontend deployment package
7z a -tzip frontend-!TIMESTAMP!.zip frontend\dist frontend\package.json frontend\package-lock.json >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend package created: frontend-!TIMESTAMP!.zip
)

echo.
echo [*] Git repository status...
if exist ".git" (
    echo.
    git status
    echo.
    set /p COMMIT_CHOICE="Do you want to commit changes? (y/n): "
    if /i "!COMMIT_CHOICE!"=="y" (
        git add .
        git commit -m "chore: prepare for production deployment - %DATE%"
        echo [OK] Changes committed
    )
) else (
    echo [!] Not a Git repository. Skipping Git operations.
)

echo.
echo ===============================================
echo  Deployment Preparation Complete!
echo ===============================================
echo.

echo Configuration Summary:
echo -----------------------------------------------
echo Frontend URL:  !FRONTEND_URL!
echo Backend URL:   !BACKEND_URL!
echo Environment:   Production
echo Timestamp:     !TIMESTAMP!
echo.

echo Next Steps:
echo -----------------------------------------------
echo 1. Push to GitHub:
echo    git push origin main
echo.
echo 2. Deploy Backend on Render:
echo    - Go to https://render.com
echo    - Connect GitHub repository
echo    - Create new Web Service
echo    - Add environment variables from .env.production
echo    - Deploy (auto-deploys on push)
echo.
echo 3. Deploy Frontend on Vercel:
echo    - Go to https://vercel.com
echo    - Import GitHub repository
echo    - Add VITE_API_URL environment variable
echo    - Deploy (auto-deploys on push)
echo.
echo 4. Configure Custom Domain (Optional):
echo    - Add domain to Vercel frontend settings
echo    - Add subdomain to Render backend settings
echo    - Update DNS records at your registrar
echo.

echo Files Created:
echo -----------------------------------------------
echo [OK] backend\.env.production
echo [OK] frontend\.env.production
if exist "backend-!TIMESTAMP!.zip" echo [OK] backend-!TIMESTAMP!.zip
if exist "frontend-!TIMESTAMP!.zip" echo [OK] frontend-!TIMESTAMP!.zip
echo.

echo SECURITY REMINDERS:
echo -----------------------------------------------
echo 1. Never commit .env files to Git
echo 2. Keep .env.production secure and offline
echo 3. Use strong, unique JWT_SECRET
echo 4. Verify MongoDB IP whitelist includes Render IP
echo 5. Enable HTTPS on all endpoints
echo 6. Review security headers in vercel.json
echo.

echo Documentation:
echo -----------------------------------------------
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo See MONITORING_GUIDE.md for production monitoring
echo See DEPLOYMENT_CHECKLIST.md for verification steps
echo.

echo Ready to deploy! 
echo ===============================================
echo.

pause
