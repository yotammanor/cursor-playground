"""Tests for SQLAlchemy models."""

from datetime import datetime

from common.models import Task, User


class TestUser:
    """Test User model."""

    def test_user_creation(self, test_db):
        """Test creating a user."""
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        assert user.id is not None
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.hashed_password == "hashed_password_123"
        assert user.is_active is True
        assert isinstance(user.created_at, datetime)
        assert isinstance(user.updated_at, datetime)

    def test_user_default_values(self, test_db):
        """Test user default values."""
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        assert user.is_active is True
        assert user.created_at is not None
        assert user.updated_at is not None

    def test_user_string_representation(self, test_db):
        """Test user string representation."""
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        # Test that the user can be converted to string (for debugging)
        str_repr = str(user)
        assert "User" in str_repr
        assert "testuser" in str_repr


class TestTask:
    """Test Task model."""

    def test_task_creation(self, test_db):
        """Test creating a task."""
        # First create a user
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        # Then create a task for that user
        task = Task(title="Test Task", description="This is a test task", user_id=user.id, is_completed=False)
        test_db.add(task)
        test_db.commit()
        test_db.refresh(task)

        assert task.id is not None
        assert task.title == "Test Task"
        assert task.description == "This is a test task"
        assert task.user_id == user.id
        assert task.is_completed is False
        assert isinstance(task.created_at, datetime)
        assert isinstance(task.updated_at, datetime)

    def test_task_default_values(self, test_db):
        """Test task default values."""
        # First create a user
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        task = Task(title="Test Task", user_id=user.id)
        test_db.add(task)
        test_db.commit()
        test_db.refresh(task)

        assert task.is_completed is False
        assert task.created_at is not None
        assert task.updated_at is not None

    def test_task_without_description(self, test_db):
        """Test creating a task without description."""
        # First create a user
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        task = Task(title="Test Task", user_id=user.id)
        test_db.add(task)
        test_db.commit()
        test_db.refresh(task)

        assert task.description is None
        assert task.title == "Test Task"

    def test_task_string_representation(self, test_db):
        """Test task string representation."""
        # First create a user
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        task = Task(title="Test Task", description="This is a test task", user_id=user.id)
        test_db.add(task)
        test_db.commit()
        test_db.refresh(task)

        # Test that the task can be converted to string (for debugging)
        str_repr = str(task)
        assert "Task" in str_repr
        assert "Test Task" in str_repr
