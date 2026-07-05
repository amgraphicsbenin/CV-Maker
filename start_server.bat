@echo off
title CV Maker Server
cd /d "%~dp0"

echo ===================================================
echo               STARTING CV MAKER SERVER
echo ===================================================

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js at https://nodejs.org and try again.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies, please wait...
    call npm install
)

:: Build the project if dist folder doesn't exist
if not exist "dist" (
    echo [INFO] Building the project for production...
    call npm run build
)

echo [INFO] Starting the Express server...
echo The app will be available at http://localhost:3000
start http://localhost:3000
node server.js

pause
