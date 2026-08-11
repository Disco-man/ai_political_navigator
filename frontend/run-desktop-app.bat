@echo off
echo ========================================
echo  AI Political Navigator - Desktop App
echo ========================================
echo.

echo Starting desktop application...
echo.
echo IMPORTANT: Make sure the backend is running!
echo Backend should be at: http://localhost:8000
echo.

call npm run electron:dev
