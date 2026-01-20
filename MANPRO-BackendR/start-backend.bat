@echo off
echo ================================
echo   MANPRO Backend Server
echo ================================
echo.

cd /d "%~dp0"

if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file first.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting backend server...
echo Backend will run on: http://localhost:7000
echo.
echo IMPORTANT: Keep this window open!
echo Press Ctrl+C to stop the server.
echo.

:restart
node server.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ================================
    echo   Server crashed with error!
    echo ================================
    echo.
    choice /C YN /M "Restart server"
    if errorlevel 2 exit /b 1
    goto restart
)
