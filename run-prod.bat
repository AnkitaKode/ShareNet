@echo off
echo Starting ShareNet Production Environment...
echo.
 
REM Set production environment variables
set SPRING_PROFILES_ACTIVE=prod
set NODE_ENV=production

REM Build Frontend for Production
echo Building Frontend for Production...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)
cd ..

REM Build Backend for Production
echo Building Backend for Production...
cd backend
call mvnw clean package -DskipTests
if %errorlevel% neq 0 (
    echo Backend build failed!
    pause
    exit /b 1
)

REM Start Backend in Production Mode
echo Starting Backend in Production Mode...
start "ShareNet Backend (Production)" cmd /k "java -jar target/ShareNet-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod"

echo.
echo Production build completed and backend started!
echo Backend: http://localhost:8080
echo Frontend build available in frontend/dist
echo.
echo Press any key to exit...
pause >nul