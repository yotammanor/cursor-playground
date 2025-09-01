"""Tests for database utilities."""

import pytest
from sqlalchemy.orm import Session

from common.database import get_db
from common.models import Task, User


class TestDatabase:
    """Test database utilities."""

    def test_get_db_generator(self):
        """Test that get_db returns a generator."""
        db_generator = get_db()

        # Should be a generator
        assert hasattr(db_generator, "__iter__")
        assert hasattr(db_generator, "__next__")

    def test_get_db_session(self):
        """Test that get_db yields a valid session."""
        db_generator = get_db()
        db = next(db_generator)

        # Should be a SQLAlchemy session
        assert isinstance(db, Session)

        # Should be able to perform basic operations
        assert db.is_active

        # Clean up
        from contextlib import suppress

        with suppress(StopIteration):
            next(db_generator)  # This should close the session

    def test_init_db_creates_tables(self, test_db):
        """Test that init_db creates all tables."""
        # Tables should already exist due to test_db fixture
        # Let's verify they exist by querying them
        users = test_db.query(User).all()
        tasks = test_db.query(Task).all()

        # Should be able to query without errors
        assert isinstance(users, list)
        assert isinstance(tasks, list)

    def test_database_operations(self, test_db):
        """Test basic database operations."""
        # Create a user
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        # Verify user was created
        assert user.id is not None

        # Create a task for the user
        task = Task(title="Test Task", description="This is a test task", user_id=user.id)
        test_db.add(task)
        test_db.commit()
        test_db.refresh(task)

        # Verify task was created
        assert task.id is not None
        assert task.user_id == user.id

        # Query the user and verify relationship
        user_from_db = test_db.query(User).filter(User.id == user.id).first()
        assert user_from_db is not None
        assert user_from_db.username == "testuser"

    def test_database_rollback(self, test_db):
        """Test database rollback functionality."""
        # Create a user
        user = User(username="testuser", email="test@example.com", hashed_password="hashed_password_123")
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)

        # Verify user exists
        user_count_before = test_db.query(User).count()
        assert user_count_before == 1

        # Create another user but don't commit
        user2 = User(username="testuser2", email="test2@example.com", hashed_password="hashed_password_456")
        test_db.add(user2)

        # Rollback should remove the uncommitted user
        test_db.rollback()

        # Verify only the first user exists
        user_count_after = test_db.query(User).count()
        assert user_count_after == 1

    def test_database_constraints(self, test_db):
        """Test database constraints."""
        # Create a user
        user1 = User(username="testuser1", email="test1@example.com", hashed_password="hashed_password_123")
        test_db.add(user1)
        test_db.commit()

        # Try to create another user with the same username (should fail)
        user2 = User(
            username="testuser1",  # Same username
            email="test2@example.com",
            hashed_password="hashed_password_456",
        )
        test_db.add(user2)

        # Should raise an integrity error
        from sqlalchemy.exc import IntegrityError

        with pytest.raises(IntegrityError):
            test_db.commit()

        # Rollback to clean state
        test_db.rollback()

    def test_database_foreign_key_constraint(self, test_db):
        """Test foreign key constraints."""
        # Try to create a task with non-existent user_id
        task = Task(
            title="Test Task",
            description="This is a test task",
            user_id=999,  # Non-existent user ID
        )
        test_db.add(task)

        # Should raise an integrity error
        from sqlalchemy.exc import IntegrityError

        with pytest.raises(IntegrityError):
            test_db.commit()

        # Rollback to clean state
        test_db.rollback()
