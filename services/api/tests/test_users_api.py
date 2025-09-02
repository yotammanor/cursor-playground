"""Unit tests for the users API endpoints."""

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


def test_create_user(test_db, client):
    """Test creating a new user."""
    response = client.post(
        "/api/users/",
        json={"username": "newuser", "email": "new@example.com", "password": "password123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    assert "id" in data
    assert "hashed_password" not in data


def test_create_user_duplicate_email(test_db, client):
    """Test creating a user with an email that already exists."""
    # First create a user
    response = client.post(
        "/api/users/",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_read_users(test_db, client):
    """Test getting all users."""
    response = client.get("/api/users/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["username"] == "testuser"
    assert data[0]["email"] == "test@example.com"


def test_read_user(test_db, client):
    """Test getting a specific user."""
    # First get all users to find the ID
    users_response = client.get("/api/users/")
    users = users_response.json()
    user_id = users[0]["id"]

    # Then get the specific user
    response = client.get(f"/api/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"


def test_read_user_not_found(client):
    """Test getting a user that doesn't exist."""
    response = client.get("/api/users/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_update_user(test_db, client):
    """Test updating a user."""
    # First get all users to find the ID
    users_response = client.get("/api/users/")
    users = users_response.json()
    user_id = users[0]["id"]

    # Then update the user
    response = client.put(
        f"/api/users/{user_id}",
        json={"username": "updateduser"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["username"] == "updateduser"
    assert data["email"] == "test@example.com"


def test_update_user_not_found(client):
    """Test updating a user that doesn't exist."""
    response = client.put(
        "/api/users/999",
        json={"username": "updateduser"},
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_delete_user(test_db, client):
    """Test deleting a user."""
    # First get all users to find the ID
    users_response = client.get("/api/users/")
    users = users_response.json()
    user_id = users[0]["id"]

    # Then delete the user
    response = client.delete(f"/api/users/{user_id}")
    assert response.status_code == 204

    # Verify the user is gone
    get_response = client.get(f"/api/users/{user_id}")
    assert get_response.status_code == 404


def test_delete_user_not_found(client):
    """Test deleting a user that doesn't exist."""
    response = client.delete("/api/users/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"
