@echo off
setlocal
cd /d "%~dp0"

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker was not found. Install and start Docker Desktop, then try again.
  pause
  exit /b 1
)
where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven was not found. Install Maven and ensure "mvn" is on PATH.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm was not found. Install Node.js LTS and ensure npm is on PATH.
  pause
  exit /b 1
)

echo Starting PostgreSQL...
docker compose up -d postgres
if errorlevel 1 (
  echo Could not start PostgreSQL. Check that Docker Desktop is running.
  pause
  exit /b 1
)

echo Waiting briefly for PostgreSQL to initialize...
timeout /t 5 /nobreak >nul

echo Starting Spring Boot backend in a new terminal...
start "Student Management Backend" cmd /k "cd /d "%~dp0backend" && set DB_PASSWORD=postgres && mvn spring-boot:run"

echo Starting React frontend in a new terminal...
start "Student Management Frontend" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"

echo.
echo Started. React will usually be at http://localhost:5173
echo Backend API: http://localhost:8080/api/students
echo PostgreSQL: localhost:5432 (database studentdb)
echo Keep the terminal windows open while using the app.
pause
