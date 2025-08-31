# Web API Service

A FastAPI-based web service for task management with user authentication and task CRUD operations.

## Tech Stack

- **FastAPI** - Latest compatible with Pydantic 2.11.x
- **Pydantic 2.11.x** - Data validation and settings management
- **SQLAlchemy 1.3.x** - ORM for database operations
- **Alembic** - Database migrations
- **psycopg2 2.9.x** - PostgreSQL database adapter
- **uvicorn** - ASGI server
- **uv** - Python package management
- **ruff** - Code formatting and linting

## Features

- User management (create, read, update, delete)
- Task management with user association
- JWT-based authentication
- PostgreSQL database with SQLAlchemy ORM
- CORS support for frontend integration
- Comprehensive testing with pytest
- Database migrations with Alembic

## Prerequisites

- Python 3.10
- PostgreSQL database
- uv package manager

## Setup

1. **Install dependencies:**
```bash
uv sync
```

2. **Setup PostgreSQL database:**
```bash
# Create database
createdb task_management

# Or set DATABASE_URL environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
```

3. **Run database migrations:**
```bash
task db:migrate
```

4. **Run the development server:**
```bash
task dev
```

## Database Management

### Setup Database
```bash
task db:setup
```

### Run Migrations
```bash
task db:migrate
```

### Create New Migration
```bash
task db:create-migration -- "description of changes"
```

## Testing

### Unit and Integration Tests
```bash
# Run all tests
task test

# Run only unit tests
uv run pytest tests/ -m unit

# Run only integration tests
uv run pytest tests/ -m integration
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /docs` - API documentation (Swagger UI)
- `GET /openapi.json` - OpenAPI schema

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/{user_id}` - Get user by ID
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{task_id}` - Get task by ID
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task

## Development

### Code Quality
```bash
# Format code
task format

# Lint code
task lint

# Type check
task type-check
```

### Database
The service uses PostgreSQL for development and production. The database connection is configured via the `DATABASE_URL` environment variable.

## Project Structure

```
services/web-api/
├── src/
│   ├── main.py              # FastAPI application
│   └── routers/             # API route handlers
├── alembic/                 # Database migrations
│   ├── env.py              # Alembic environment
│   └── versions/           # Migration files
├── tests/
│   ├── conftest.py          # Pytest configuration
│   └── test_*.py            # Test files
├── alembic.ini             # Alembic configuration
└── Taskfile.yml            # Task definitions
``` 