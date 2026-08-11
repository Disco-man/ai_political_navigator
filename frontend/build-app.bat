@echo off
echo ========================================
echo  AI Political Navigator - Build Script
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [2/3] Building React app...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)
echo.

echo [3/3] Building Windows Desktop App...
call npm run electron:build:win
if errorlevel 1 (
    echo ERROR: Failed to build desktop app
    pause
    exit /b 1
)
echo.

echo ========================================
echo  BUILD COMPLETE!
echo ========================================
echo.
echo Your desktop app is ready in the 'release' folder:
echo.
dir /B release\*.exe 2>nul
if errorlevel 1 (
    echo No .exe files found. Check for errors above.
) else (
    echo.
    echo You can now distribute these files!
)
echo.
pause
