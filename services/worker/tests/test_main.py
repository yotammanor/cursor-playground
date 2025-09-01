"""Tests for worker main module."""

import pytest
import responses
from unittest.mock import patch, MagicMock

from worker.main import poll_for_tasks, main, celery_app


class TestPollForTasks:
    """Test poll_for_tasks function."""

    @responses.activate
    def test_poll_for_tasks_success(self):
        """Test successful polling for tasks."""
        # Mock the API response
        mock_tasks = [
            {"id": 1, "title": "Task 1", "is_completed": False},
            {"id": 2, "title": "Task 2", "is_completed": True},
            {"id": 3, "title": "Task 3", "is_completed": False},
        ]
        
        responses.add(
            responses.GET,
            "http://localhost:8000/api/tasks",
            json=mock_tasks,
            status=200
        )
        
        with patch('worker.main.process_task') as mock_process_task:
            poll_for_tasks()
            
            # Should only process incomplete tasks
            assert mock_process_task.delay.call_count == 2
            mock_process_task.delay.assert_any_call(1)
            mock_process_task.delay.assert_any_call(3)

    @responses.activate
    def test_poll_for_tasks_no_incomplete_tasks(self):
        """Test polling when all tasks are completed."""
        # Mock the API response with all completed tasks
        mock_tasks = [
            {"id": 1, "title": "Task 1", "is_completed": True},
            {"id": 2, "title": "Task 2", "is_completed": True},
        ]
        
        responses.add(
            responses.GET,
            "http://localhost:8000/api/tasks",
            json=mock_tasks,
            status=200
        )
        
        with patch('worker.main.process_task') as mock_process_task:
            poll_for_tasks()
            
            # Should not process any tasks
            mock_process_task.delay.assert_not_called()

    @responses.activate
    def test_poll_for_tasks_api_error(self):
        """Test handling API errors during polling."""
        # Mock API error
        responses.add(
            responses.GET,
            "http://localhost:8000/api/tasks",
            status=500
        )
        
        with patch('worker.main.logger.error') as mock_logger:
            poll_for_tasks()
            
            # Should log the error
            mock_logger.assert_called()

    @responses.activate
    def test_poll_for_tasks_connection_error(self):
        """Test handling connection errors during polling."""
        # Mock connection error
        responses.add(
            responses.GET,
            "http://localhost:8000/api/tasks",
            body=Exception("Connection failed")
        )
        
        with patch('worker.main.logger.error') as mock_logger:
            poll_for_tasks()
            
            # Should log the error
            mock_logger.assert_called()

    @responses.activate
    def test_poll_for_tasks_empty_response(self):
        """Test polling with empty task list."""
        responses.add(
            responses.GET,
            "http://localhost:8000/api/tasks",
            json=[],
            status=200
        )
        
        with patch('worker.main.process_task') as mock_process_task:
            poll_for_tasks()
            
            # Should not process any tasks
            mock_process_task.delay.assert_not_called()


class TestMain:
    """Test main function."""

    @patch('worker.main.poll_for_tasks')
    @patch('worker.main.time.sleep')
    @patch('worker.main.logger.info')
    def test_main_success(self, mock_logger, mock_sleep, mock_poll):
        """Test successful main execution."""
        # Mock KeyboardInterrupt to stop the infinite loop
        mock_sleep.side_effect = KeyboardInterrupt()
        
        main()
        
        # Verify polling was called
        mock_poll.assert_called_once()
        
        # Verify logging
        mock_logger.assert_any_call("Starting worker service...")
        mock_logger.assert_any_call("Database schema managed by Alembic migrations")
        mock_logger.assert_any_call("Worker service stopped")

    @patch('worker.main.poll_for_tasks')
    @patch('worker.main.time.sleep')
    @patch('worker.main.logger.info')
    def test_main_database_error(self, mock_logger, mock_sleep, mock_poll):
        """Test main function execution."""
        # Mock KeyboardInterrupt to stop the infinite loop
        mock_sleep.side_effect = KeyboardInterrupt()
        
        main()
        
        # Verify logging
        mock_logger.assert_called_with("Starting worker service...")


class TestCeleryApp:
    """Test Celery app configuration."""

    def test_celery_app_configuration(self):
        """Test Celery app is properly configured."""
        assert celery_app.name == "worker"
        assert "redis://localhost:6379/0" in str(celery_app.conf.broker_url)
        assert "redis://localhost:6379/0" in str(celery_app.conf.result_backend)

    def test_celery_tasks_registered(self):
        """Test that tasks are registered with Celery."""
        from worker.tasks import process_task, send_notification
        
        # Verify tasks are registered
        assert process_task in celery_app.tasks.values()
        assert send_notification in celery_app.tasks.values()

