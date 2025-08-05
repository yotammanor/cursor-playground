"""Unit tests for the users API endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from common.database import Base, get_db
from common.models import User
from common.utils import get_password_hash

# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the database tables
Base.metadata.create_all(bind=engine)


# Dependency override for database session
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
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
    db.close()
    
    yield  # Run the test
    
    # Clean up
    Base.metadata.drop_all(bind=engine)


def test_create_user():
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


def test_create_user_duplicate_email(test_db):
    """Test creating a user with an email that already exists."""
    # First create a user
    response = client.post(
        "/api/users/",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_read_users(test_db):
    """Test getting all users."""
    response = client.get("/api/users/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["username"] == "testuser"
    assert data[0]["email"] == "test@example.com"


def test_read_user(test_db):
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


def test_read_user_not_found():
    """Test getting a user that doesn't exist."""
    response = client.get("/api/users/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_update_user(test_db):
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


def test_update_user_not_found():
    """Test updating a user that doesn't exist."""
    response = client.put(
        "/api/users/999",
        json={"username": "updateduser"},
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_delete_user(test_db):
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


def test_delete_user_not_found():
    """Test deleting a user that doesn't exist."""
    response = client.delete("/api/users/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found" 