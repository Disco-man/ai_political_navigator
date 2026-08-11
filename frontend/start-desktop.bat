@echo off
echo Killing any process on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a 2>nul

echo.
echo Starting Desktop App...
echo.
timeout /t 2 /nobreak >nul

npm run electron:dev
