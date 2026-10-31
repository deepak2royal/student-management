#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

command -v docker >/dev/null || { echo "Install Docker and start Docker Desktop/daemon first."; exit 1; }
command -v mvn >/dev/null || { echo "Install Maven 3.9+ first."; exit 1; }
command -v npm >/dev/null || { echo "Install Node.js LTS first."; exit 1; }

docker compose up -d postgres
echo "Starting backend and frontend in separate background processes..."
(
  cd backend
  export DB_PASSWORD="${DB_PASSWORD:-postgres}"
  mvn spring-boot:run
) &
BACKEND_PID=$!
(
  cd frontend
  npm install
  npm run dev -- --host 0.0.0.0
) &
FRONTEND_PID=$!
echo "React: http://localhost:5173"
echo "Backend: http://localhost:8080/api/students"
trap 'kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true' INT TERM
wait
