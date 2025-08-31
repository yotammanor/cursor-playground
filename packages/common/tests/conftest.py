"""Pytest configuration and fixtures for common package tests."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from common.models import Base


@pytest.fixture
def test_db():
    """Create a test database with in-memory SQLite."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Enable foreign key constraints for SQLite
    with engine.connect() as conn:
        conn.execute("PRAGMA foreign_keys = ON")
    
    # Create a session
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }


@pytest.fixture
def sample_task_data():
    """Sample task data for testing."""
    return {
        "title": "Test Task",
        "description": "This is a test task",
        "user_id": 1
    }
