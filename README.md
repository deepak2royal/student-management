<<<<<<< HEAD
# Student Management System — React + Spring Boot + PostgreSQL

A ready-to-run CRUD starter project.

## Prerequisites
Install:
- Java 17 or 21
- Maven 3.9+
- Node.js LTS (includes npm)
- Docker Desktop (recommended, for PostgreSQL)

## Fast start (Windows)
1. Extract this ZIP.
2. Open the project folder.
3. Double-click `run.bat`.
4. Wait for PostgreSQL and the backend to start, then open the React URL printed by Vite (normally http://localhost:5173).

The script starts PostgreSQL with Docker Compose, then opens separate terminal windows for the Spring Boot backend and React frontend.

## Fast start (macOS/Linux)
From this folder, run:
```bash
chmod +x run.sh
./run.sh
```

## Manual start
Start PostgreSQL:
```bash
docker compose up -d postgres
```

Start backend in a terminal:
```bash
cd backend
# Windows PowerShell: $env:DB_PASSWORD="postgres"
# macOS/Linux: export DB_PASSWORD=postgres
mvn spring-boot:run
```

Start frontend in another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## API endpoints
Base URL: `http://localhost:8080/api/students`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List students |
| GET | `/api/students/{id}` | Get one student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |

Example POST JSON:
```json
{
  "name": "Deepak",
  "email": "deepak@example.com",
  "course": "Java Full Stack"
}
```

## Database
Docker Compose creates:
- Database: `studentdb`
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

These are local-development credentials only. Change them before using this project beyond local development.

Student table schema is managed by Hibernate (`spring.jpa.hibernate.ddl-auto=update`).

## Troubleshooting
- If port 5432 is already in use, stop the other PostgreSQL instance or change the port mapping in `docker-compose.yml`.
- If the backend cannot connect, check `docker compose ps` and `docker compose logs postgres`.
- If `mvn` is not found, install Maven or open the project in an IDE and run `StudentManagementApplication`.
- If `npm` is not found, install Node.js LTS.
- First Maven/npm runs need internet access to download dependencies.
=======
# student-management
Student details
>>>>>>> 63fc36a96795f39684598c2bfa254053b2141ad3
