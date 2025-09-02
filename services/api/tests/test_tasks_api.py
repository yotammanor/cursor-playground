"""Unit tests for the tasks API endpoints."""

import os
import tempfile

from common.database import get_db
from common.models import Base, User
from common.utils import get_password_hash
from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.main import app


@pytest.fixture
def test_db():
    """Create a new database for each test."""
    # Create a temporary database file
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        db_path = tmp.name

    # Create engine for this test
    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create session factory
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create a test user
    db = TestingSessionLocal()
    test_user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("password123"),
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    user_id = test_user.id
    db.close()

    # Override the database dependency for this test
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    yield user_id  # Return the user ID

    # Clean up
    app.dependency_overrides.clear()
    engine.dispose()

    # Remove the temporary database file
    try:
        os.unlink(db_path)
    except OSError:
        pass


@pytest.fixture
def client():
    """Create a test client."""
    return TestClient(app)


def test_create_task(test_db, client):
    """Test creating a new task."""
    response = client.post(
        "/api/tasks/",
        json={"title": "Test Task", "description": "This is a test task", "user_id": test_db},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "This is a test task"
    assert data["user_id"] == test_db
    assert data["status"] == "pending"
    assert "id" in data


def test_create_task_user_not_found(client):
    """Test creating a task with a non-existent user ID."""
    response = client.post(
        "/api/tasks/",
        json={"title": "Test Task", "description": "This is a test task", "user_id": 999},
    )
    assert response.status_code == 404
    assert "User with id 999 not found" in response.json()["detail"]


def test_create_task_no_slash(test_db, client):
    """Test creating a task without trailing slash."""
    response = client.post(
        "/api/tasks",
        json={"title": "Test Task No Slash", "description": "This is a test task without slash", "user_id": test_db},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task No Slash"
    assert data["user_id"] == test_db


def test_read_tasks(test_db, client):
    """Test getting all tasks."""
    response = client.get("/api/tasks/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_read_tasks_no_slash(test_db, client):
    """Test getting all tasks without trailing slash."""
    response = client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_read_user_tasks(test_db, client):
    """Test getting tasks for a specific user."""
    # First create a task
    client.post(
        "/api/tasks/",
        json={"title": "User Task", "description": "Task for specific user", "user_id": test_db},
    )

    response = client.get(f"/api/tasks/user/{test_db}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["user_id"] == test_db


def test_read_task(test_db, client):
    """Test getting a specific task by ID."""
    # First create a task
    create_response = client.post(
        "/api/tasks/",
        json={"title": "Specific Task", "description": "Task to read", "user_id": test_db},
    )
    task_id = create_response.json()["id"]

    # Then get the specific task
    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Specific Task"
    assert data["user_id"] == test_db


def test_read_task_not_found(client):
    """Test getting a task that doesn't exist."""
    response = client.get("/api/tasks/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_update_task(test_db, client):
    """Test updating a task."""
    # First create a task
    create_response = client.post(
        "/api/tasks/",
        json={"title": "Original Task", "description": "Original description", "user_id": test_db},
    )
    task_id = create_response.json()["id"]

    # Then update the task
    response = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Updated Task", "description": "Updated description"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Updated Task"
    assert data["description"] == "Updated description"


def test_update_task_not_found(client):
    """Test updating a task that doesn't exist."""
    response = client.put(
        "/api/tasks/999",
        json={"title": "Updated Task"},
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_delete_task(test_db, client):
    """Test deleting a task."""
    # First create a task
    create_response = client.post(
        "/api/tasks/",
        json={"title": "Task to Delete", "description": "This task will be deleted", "user_id": test_db},
    )
    task_id = create_response.json()["id"]

    # Then delete the task
    response = client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == 204

    # Verify the task is gone
    get_response = client.get(f"/api/tasks/{task_id}")
    assert get_response.status_code == 404


def test_delete_task_not_found(client):
    """Test deleting a task that doesn't exist."""
    response = client.delete("/api/tasks/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_get_pending_tasks(test_db, client):
    """Test getting pending tasks for workers."""
    # Create a pending task
    client.post(
        "/api/tasks/",
        json={"title": "Pending Task", "description": "This is a pending task", "user_id": test_db},
    )

    response = client.get("/api/tasks/worker/pending")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # All tasks should be pending
    for task in data:
        assert task["status"] == "pending"


def test_update_task_status(test_db, client):
    """Test updating task status (worker operation)."""
    # First create a task
    create_response = client.post(
        "/api/tasks/",
        json={"title": "Status Update Task", "description": "Task for status updates", "user_id": test_db},
    )
    task_id = create_response.json()["id"]

    # Update status to WIP
    response = client.put(
        f"/api/tasks/{task_id}/status",
        json={"status": "wip", "worker_id": "worker-123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "wip"
    assert data["worker_id"] == "worker-123"
    assert data["started_at"] is not None

    # Update status to DONE
    response = client.put(
        f"/api/tasks/{task_id}/status",
        json={"status": "done", "worker_id": "worker-123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "done"
    assert data["completed_at"] is not None


def test_update_task_status_with_error(test_db, client):
    """Test updating task status with error message."""
    # First create a task
    create_response = client.post(
        "/api/tasks/",
        json={"title": "Error Task", "description": "Task that will fail", "user_id": test_db},
    )
    task_id = create_response.json()["id"]

    # Update status to FAILED with error
    response = client.put(
        f"/api/tasks/{task_id}/status",
        json={"status": "failed", "worker_id": "worker-123", "error_message": "Something went wrong"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "failed"
    assert data["error_message"] == "Something went wrong"
    assert data["completed_at"] is not None


def test_update_task_status_not_found(client):
    """Test updating status for a task that doesn't exist."""
    response = client.put(
        "/api/tasks/999/status",
        json={"status": "wip", "worker_id": "worker-123"},
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"
