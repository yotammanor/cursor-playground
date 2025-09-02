"""Test schemas."""

from datetime import datetime

import pytest

from common.models import TaskStatus
from common.schemas import Task, TaskBase, TaskCreate, TaskUpdate, User, UserBase, UserCreate, UserUpdate


class TestUserSchemas:
    """Test User-related schemas."""

    def test_user_base_valid(self):
        """Test valid UserBase schema."""
        user_data = {"username": "testuser", "email": "test@example.com"}
        user = UserBase(**user_data)

        assert user.username == "testuser"
        assert user.email == "test@example.com"

    def test_user_base_invalid_email(self):
        """Test UserBase with invalid email."""
        user_data = {"username": "testuser", "email": "invalid-email"}
        with pytest.raises(ValueError):
            UserBase(**user_data)

    def test_user_create_valid(self):
        """Test valid UserCreate schema."""
        user_data = {"username": "testuser", "email": "test@example.com", "password": "password123"}
        user = UserCreate(**user_data)

        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.password == "password123"

    def test_user_update_partial(self):
        """Test UserUpdate with partial data."""
        user_data = {"username": "updateduser"}
        user = UserUpdate(**user_data)

        assert user.username == "updateduser"
        assert user.email is None
        assert user.password is None
        assert user.is_active is None

    def test_user_update_all_fields(self):
        """Test UserUpdate with all fields."""
        user_data = {
            "username": "updateduser",
            "email": "updated@example.com",
            "password": "newpassword",
            "is_active": False,
        }
        user = UserUpdate(**user_data)

        assert user.username == "updateduser"
        assert user.email == "updated@example.com"
        assert user.password == "newpassword"
        assert user.is_active is False

    def test_user_schema_valid(self):
        """Test valid User schema."""
        now = datetime.now()
        user_data = {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }
        user = User(**user_data)

        assert user.id == 1
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.is_active is True
        assert user.created_at == now
        assert user.updated_at == now


class TestTaskSchemas:
    """Test Task-related schemas."""

    def test_task_base_valid(self):
        """Test valid TaskBase schema."""
        task_data = {"title": "Test Task", "description": "This is a test task"}
        task = TaskBase(**task_data)

        assert task.title == "Test Task"
        assert task.description == "This is a test task"

    def test_task_base_without_description(self):
        """Test TaskBase without description."""
        task_data = {"title": "Test Task"}
        task = TaskBase(**task_data)

        assert task.title == "Test Task"
        assert task.description is None

    def test_task_create_valid(self):
        """Test valid TaskCreate schema."""
        task_data = {"title": "Test Task", "description": "This is a test task", "user_id": 1}
        task = TaskCreate(**task_data)

        assert task.title == "Test Task"
        assert task.description == "This is a test task"
        assert task.user_id == 1

    def test_task_update_partial(self):
        """Test TaskUpdate with partial data."""
        task_data = {"title": "Updated Task"}
        task = TaskUpdate(**task_data)

        assert task.title == "Updated Task"
        assert task.description is None
        assert task.status is None

    def test_task_update_all_fields(self):
        """Test TaskUpdate with all fields."""
        task_data = {"title": "Updated Task", "description": "Updated description", "status": TaskStatus.DONE}
        task = TaskUpdate(**task_data)

        assert task.title == "Updated Task"
        assert task.description == "Updated description"
        assert task.status == TaskStatus.DONE

    def test_task_schema_valid(self):
        """Test valid Task schema."""
        now = datetime.now()
        task_data = {
            "id": 1,
            "title": "Test Task",
            "description": "This is a test task",
            "status": TaskStatus.PENDING,
            "user_id": 1,
            "created_at": now,
            "updated_at": now,
        }
        task = Task(**task_data)

        assert task.id == 1
        assert task.title == "Test Task"
        assert task.description == "This is a test task"
        assert task.status == TaskStatus.PENDING
        assert task.user_id == 1
        assert task.created_at == now
        assert task.updated_at == now

    def test_task_schema_without_description(self):
        """Test Task schema without description."""
        now = datetime.now()
        task_data = {
            "id": 1,
            "title": "Test Task",
            "status": TaskStatus.PENDING,
            "user_id": 1,
            "created_at": now,
            "updated_at": now,
        }
        task = Task(**task_data)

        assert task.id == 1
        assert task.title == "Test Task"
        assert task.description is None
        assert task.status == TaskStatus.PENDING
        assert task.user_id == 1
