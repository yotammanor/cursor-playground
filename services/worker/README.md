# Worker Service

A background worker service for processing tasks asynchronously.

## Tech Stack

- **Celery** - Task queue and background job processing
- **Redis** - Message broker and result backend
- **Pydantic 2.11.x** - Data validation and settings management
- **SQLAlchemy 1.3.x** - ORM for database operations
- **psycopg2 2.9.x** - PostgreSQL database adapter
- **uv** - Python package management
- **ruff** - Code formatting and linting

## Prerequisites

- Python 3.10
- PostgreSQL database
- Redis server
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

3. **Run the worker:**
```bash
uv run python -m worker.main
```

## Dependencies

- **Redis** (for Celery message broker)
- **PostgreSQL** (for task data)

Make sure Redis is running locally on the default port (6379) or update the connection details in `worker/main.py`.

## Tasks

The worker service processes the following tasks:

- **Task Processing**: Processes tasks marked as incomplete and updates their status
- **Notifications**: Sends notifications to users when their tasks are completed

## Architecture

This worker service polls the web API periodically for new tasks and processes them asynchronously using Celery.

## Development

### Code Quality
```bash
# Format code
uv run ruff format worker/

# Lint code
uv run ruff check worker/ --fix
``` 