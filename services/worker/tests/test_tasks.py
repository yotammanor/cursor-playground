"""Tests for worker tasks."""

import pytest
import responses
from unittest.mock import patch, MagicMock

from common.models import User, Task
from common.utils import get_password_hash
from worker.tasks import process_task, send_notification


class TestProcessTask:
    """Test process_task function."""

    def test_process_task_success(self, test_db):
        """Test successful task processing."""
        # Create a user first
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash("password123")
        )
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)
        
        # Create a task
        task = Task(
            title="Test Task",
            description="This is a test task",
            user_id=user.id,
            is_completed=False
        )
        test_db.add(task)
        test_db.commit()
        test_db.refresh(task)
        
        # Mock the get_db function to return our test database
        with patch('worker.tasks.get_db') as mock_get_db:
            mock_get_db.return_value = iter([test_db])
            
            # Mock time.sleep to speed up tests
            with patch('worker.tasks.time.sleep'):
                result = process_task(task.id)
        
        # Verify the result
        assert result["status"] == "success"
        assert result["task_id"] == task.id
        
        # Verify the task was marked as completed
        test_db.refresh(task)
        assert task.is_completed is True

    def test_process_task_not_found(self, test_db):
        """Test processing a task that doesn't exist."""
        with patch('worker.tasks.get_db') as mock_get_db:
            mock_get_db.return_value = iter([test_db])
            
            with patch('worker.tasks.time.sleep'):
                result = process_task(999)
        
        assert result["status"] == "error"
        assert "not found" in result["message"]

    def test_process_task_database_error(self, test_db):
        """Test handling database errors during task processing."""
        with patch('worker.tasks.get_db') as mock_get_db:
            # Simulate a database error
            mock_get_db.side_effect = Exception("Database connection failed")
            
            with patch('worker.tasks.time.sleep'):
                result = process_task(1)
        
        assert result["status"] == "error"
        assert "Database connection failed" in result["message"]

    def test_process_task_with_notification(self, test_db):
        """Test task processing with notification."""
        # Create a user first
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash("password123")
        )
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)
        
        # Create a task
        task = Task(
            title="Test Task",
            description="This is a test task",
            user_id=user.id,
            is_completed=False
        )
        test_db.add(task)
        test_db.commit()
        test_db.refresh(task)
        
        with patch('worker.tasks.get_db') as mock_get_db:
            mock_get_db.return_value = iter([test_db])
            
            with patch('worker.tasks.time.sleep'):
                with patch('worker.tasks.send_notification') as mock_send_notification:
                    result = process_task(task.id)
        
        # Verify the result
        assert result["status"] == "success"
        
        # Verify notification was sent
        mock_send_notification.assert_called_once_with(
            user_id=user.id,
            message=f"Task '{task.title}' has been completed"
        )


class TestSendNotification:
    """Test send_notification function."""

    def test_send_notification_success(self):
        """Test successful notification sending."""
        with patch('worker.tasks.time.sleep'):
            result = send_notification(
                user_id=1,
                message="Test notification"
            )
        
        assert result["status"] == "success"
        assert result["user_id"] == 1
        assert result["message"] == "Test notification"

    def test_send_notification_with_different_message(self):
        """Test notification with different message."""
        with patch('worker.tasks.time.sleep'):
            result = send_notification(
                user_id=2,
                message="Another test notification"
            )
        
        assert result["status"] == "success"
        assert result["user_id"] == 2
        assert result["message"] == "Another test notification"

    def test_send_notification_simulates_processing_time(self):
        """Test that notification simulates processing time."""
        with patch('worker.tasks.time.sleep') as mock_sleep:
            send_notification(user_id=1, message="Test")
            
            # Verify sleep was called
            mock_sleep.assert_called_once_with(1)

