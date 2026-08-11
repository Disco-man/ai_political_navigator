@echo off
title AI Political Navigator - Launcher
color 0A

REM Go to project root (folder where this .bat file is)
cd /d "%~dp0"

:MENU
cls
echo ========================================
echo   AI POLITICAL NAVIGATOR
echo   Desktop Application Launcher
echo ========================================
echo.
echo Please choose an option:
echo.
echo [1] Start Backend + Desktop App (RECOMMENDED)
echo [2] Start Backend Only
echo [3] Start Desktop App Only (backend must be running)
echo [4] Build Desktop App (.exe installer)
echo [5] Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto START_ALL
if "%choice%"=="2" goto START_BACKEND
if "%choice%"=="3" goto START_APP
if "%choice%"=="4" goto BUILD_APP
if "%choice%"=="5" goto EXIT
goto MENU

:START_ALL
echo.
echo ========================================
echo Starting Backend and Desktop App...
echo ========================================
echo.
echo [Step 1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd /d "%~dp0" && cd backend && .\venv\Scripts\activate && python main.py"
echo Backend server started in new window!
echo.
timeout /t 3 /nobreak >nul
echo [Step 2/2] Starting Desktop App...
cd frontend
call npm run electron:dev
goto END

:START_BACKEND
echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo.
cd backend
call .\venv\Scripts\activate
python main.py
goto END

:START_APP
echo.
echo ========================================
echo Starting Desktop App...
echo ========================================
echo.
echo IMPORTANT: Make sure backend is running at http://localhost:8000
echo.
timeout /t 2 /nobreak >nul
cd frontend
call npm run electron:dev
goto END

:BUILD_APP
echo.
echo ========================================
echo Building Desktop Application...
echo ========================================
echo.
cd frontend
call build-app.bat
goto MENU

:EXIT
echo.
echo Thank you for using AI Political Navigator!
timeout /t 2 /nobreak >nul
exit

:END
echo.
echo ========================================
echo Press any key to return to menu...
pause >nul
goto MENU
