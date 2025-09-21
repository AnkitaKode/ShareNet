@echo off
echo Starting ShareNet Development Environment...
echo.

REM Check if MySQL is running
echo Checking MySQL service...
sc query mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL service not found. Please ensure MySQL is installed and running.
    pause
    exit /b 1
)

REM Start Backend
echo Starting Backend Server...
start "ShareNet Backend" cmd /k "cd /d backend && mvnw spring-boot:run"

REM Wait a bit for backend to start
timeout /t 10 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server...
start "ShareNet Frontend" cmd /k "cd /d frontend && npm run dev"

echo.
echo Both applications are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
