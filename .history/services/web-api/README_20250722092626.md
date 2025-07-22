# Web API Service

A FastAPI-based web service for the Task Management application.

## Setup

```bash
# Create virtual environment
mkvirtualenv web-api

# Install dependencies
pip install -e ../common
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/{user_id}` - Get a specific user
- `PUT /api/users/{user_id}` - Update a user
- `DELETE /api/users/{user_id}` - Delete a user

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{task_id}` - Get a specific task
- `PUT /api/tasks/{task_id}` - Update a task
- `DELETE /api/tasks/{task_id}` - Delete a task
- `GET /api/tasks/user/{user_id}` - Get tasks for a specific user 