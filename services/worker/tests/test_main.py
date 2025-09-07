"""Tests for worker main module."""

import pytest
import responses
from unittest.mock import patch, MagicMock, call
import argparse
import requests

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from main import (
    get_pending_tasks,
    process_task,
    update_task_status,
    parse_arguments,
    main,
    WORKER_ID,
    API_BASE_URL,
    AUTO_SHUTDOWN_DELAY,
)
from common.models import TaskStatus
from common.schemas import Task


class TestParseArguments:
    """Test argument parsing functionality."""

    def test_parse_arguments_default(self):
        """Test parsing arguments with no flags."""
        with patch("sys.argv", ["worker"]):
            args = parse_arguments()
            assert args.auto_shutdown is False

    def test_parse_arguments_with_auto_shutdown(self):
        """Test parsing arguments with auto-shutdown flag."""
        with patch("sys.argv", ["worker", "--auto-shutdown"]):
            args = parse_arguments()
            assert args.auto_shutdown is True


class TestUpdateTaskStatus:
    """Test update_task_status function."""

    @responses.activate
    def test_update_task_status_success(self):
        """Test successful task status update."""
        task_id = 1
        status = TaskStatus.WIP
        error_message = None
        
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/{task_id}/status",
            json={"status": status, "worker_id": WORKER_ID},
            status=200
        )
        
        result = update_task_status(task_id, status, error_message)
        assert result is True

    @responses.activate
    def test_update_task_status_with_error_message(self):
        """Test task status update with error message."""
        task_id = 1
        status = TaskStatus.FAILED
        error_message = "Task processing failed"
        
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/{task_id}/status",
            json={"status": status, "worker_id": WORKER_ID, "error_message": error_message},
            status=200
        )
        
        result = update_task_status(task_id, status, error_message)
        assert result is True

    @responses.activate
    def test_update_task_status_api_error(self):
        """Test task status update when API returns error."""
        task_id = 1
        status = TaskStatus.WIP
        
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/{task_id}/status",
            status=500
        )
        
        result = update_task_status(task_id, status)
        assert result is False

    @responses.activate
    def test_update_task_status_connection_error(self):
        """Test task status update when connection fails."""
        task_id = 1
        status = TaskStatus.WIP
        
        # Mock a connection error by making the request timeout
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/{task_id}/status",
            body=requests.exceptions.ConnectionError("Connection failed")
        )
        
        result = update_task_status(task_id, status)
        assert result is False


class TestGetPendingTasks:
    """Test get_pending_tasks function."""

    @responses.activate
    def test_get_pending_tasks_success(self):
        """Test successful getting of pending tasks."""
        mock_tasks_data = [
            {"id": 1, "title": "Task 1", "status": "pending", "description": None, "user_id": 1, "worker_id": None, "started_at": None, "completed_at": None, "error_message": None, "created_at": "2024-01-01T00:00:00", "updated_at": "2024-01-01T00:00:00"},
            {"id": 2, "title": "Task 2", "status": "pending", "description": None, "user_id": 1, "worker_id": None, "started_at": None, "completed_at": None, "error_message": None, "created_at": "2024-01-01T00:00:00", "updated_at": "2024-01-01T00:00:00"},
        ]
        
        responses.add(
            responses.GET,
            f"{API_BASE_URL}/tasks/worker/pending",
            json=mock_tasks_data,
            status=200
        )
        
        result = get_pending_tasks()
        
        assert len(result) == 2
        assert result[0].id == 1
        assert result[1].id == 2
        assert isinstance(result[0], Task)
        assert isinstance(result[1], Task)

    @responses.activate
    def test_get_pending_tasks_empty_response(self):
        """Test getting pending tasks when none exist."""
        responses.add(
            responses.GET,
            f"{API_BASE_URL}/tasks/worker/pending",
            json=[],
            status=200
        )
        
        result = get_pending_tasks()
        assert result == []

    @responses.activate
    def test_get_pending_tasks_api_error(self):
        """Test handling API errors when getting pending tasks."""
        responses.add(
            responses.GET,
            f"{API_BASE_URL}/tasks/worker/pending",
            status=500
        )
        
        result = get_pending_tasks()
        assert result == []

    @responses.activate
    def test_get_pending_tasks_connection_error(self):
        """Test handling connection errors when getting pending tasks."""
        responses.add(
            responses.GET,
            f"{API_BASE_URL}/tasks/worker/pending",
            body=requests.exceptions.ConnectionError("Connection failed")
        )
        
        result = get_pending_tasks()
        assert result == []


class TestProcessTask:
    """Test process_task function."""

    @responses.activate
    def test_process_task_success(self):
        """Test successful task processing."""
        task = Task(
            id=1, 
            title="Test Task", 
            status=TaskStatus.PENDING,
            description=None,
            user_id=1,
            worker_id=None,
            started_at=None,
            completed_at=None,
            error_message=None,
            created_at="2024-01-01T00:00:00",
            updated_at="2024-01-01T00:00:00"
        )
        
        # Mock successful status updates
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/1/status",
            json={"status": "wip"},
            status=200
        )
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/1/status",
            json={"status": "done"},
            status=200
        )
        
        with patch("main.time.sleep") as mock_sleep:
            result = process_task(task)
            
            # Should sleep for 10 seconds (simulating work)
            mock_sleep.assert_called_with(10)
            assert result is True

    @responses.activate
    def test_process_task_wip_status_failure(self):
        """Test task processing when WIP status update fails."""
        task = Task(
            id=1, 
            title="Test Task", 
            status=TaskStatus.PENDING,
            description=None,
            user_id=1,
            worker_id=None,
            started_at=None,
            completed_at=None,
            error_message=None,
            created_at="2024-01-01T00:00:00",
            updated_at="2024-01-01T00:00:00"
        )
        
        # Mock failed WIP status update
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/1/status",
            status=500
        )
        
        with patch("main.time.sleep"):
            result = process_task(task)
            assert result is False

    @responses.activate
    def test_process_task_done_status_failure(self):
        """Test task processing when DONE status update fails."""
        task = Task(
            id=1, 
            title="Test Task", 
            status=TaskStatus.PENDING,
            description=None,
            user_id=1,
            worker_id=None,
            started_at=None,
            completed_at=None,
            error_message=None,
            created_at="2024-01-01T00:00:00",
            updated_at="2024-01-01T00:00:00"
        )
        
        # Mock successful WIP status update but failed DONE status update
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/1/status",
            json={"status": "wip"},
            status=200
        )
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/1/status",
            json={"status": "done"},
            status=500
        )
        
        with patch("main.time.sleep"):
            result = process_task(task)
            assert result is False

    @responses.activate
    def test_process_task_exception_handling(self):
        """Test task processing when an exception occurs."""
        task = Task(
            id=1, 
            title="Test Task", 
            status=TaskStatus.PENDING,
            description=None,
            user_id=1,
            worker_id=None,
            started_at=None,
            completed_at=None,
            error_message=None,
            created_at="2024-01-01T00:00:00",
            updated_at="2024-01-01T00:00:00"
        )
        
        # Mock successful WIP status update
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/1/status",
            json={"status": "wip"},
            status=200
        )
        
        # Mock failed status update for exception case
        responses.add(
            responses.PUT,
            f"{API_BASE_URL}/tasks/1/status",
            json={"status": "failed"},
            status=200
        )
        
        with patch("main.time.sleep", side_effect=Exception("Test error")):
            result = process_task(task)
            assert result is False


class TestMainFunction:
    """Test main function."""

    @patch("main.get_pending_tasks")
    @patch("main.process_task")
    @patch("main.time.sleep")
    @patch("main.parse_arguments")
    def test_main_function_basic_flow(self, mock_parse_args, mock_sleep, mock_process_task, mock_get_pending_tasks):
        """Test basic main function flow with tasks."""
        # Mock arguments
        mock_args = MagicMock()
        mock_args.auto_shutdown = False
        mock_parse_args.return_value = mock_args
        
        # Mock getting pending tasks
        mock_get_pending_tasks.side_effect = [
            [
                Task(id=1, title="Task 1", status=TaskStatus.PENDING, description=None, user_id=1, worker_id=None, started_at=None, completed_at=None, error_message=None, created_at="2024-01-01T00:00:00", updated_at="2024-01-01T00:00:00"),
                Task(id=2, title="Task 2", status=TaskStatus.PENDING, description=None, user_id=1, worker_id=None, started_at=None, completed_at=None, error_message=None, created_at="2024-01-01T00:00:00", updated_at="2024-01-01T00:00:00"),
            ],
            KeyboardInterrupt(),
        ]
        
        # Mock successful task processing
        mock_process_task.return_value = True
        
        # Mock sleep to avoid long waits
        mock_sleep.return_value = None
        
        # Run main function; it will exit via KeyboardInterrupt side effect
        main()
        
        # Verify that tasks were processed
        assert mock_get_pending_tasks.called
        assert mock_process_task.call_count == 2
        # Verify sleep calls: 1 second between tasks + poll interval
        assert mock_sleep.call_count >= 3

    @patch("main.get_pending_tasks")
    @patch("main.time.sleep")
    @patch("main.parse_arguments")
    def test_main_function_no_pending_tasks(self, mock_parse_args, mock_sleep, mock_get_pending_tasks):
        """Test main function when no pending tasks exist."""
        # Mock arguments
        mock_args = MagicMock()
        mock_args.auto_shutdown = False
        mock_parse_args.return_value = mock_args
        
        # Mock no pending tasks
        mock_get_pending_tasks.side_effect = [[], KeyboardInterrupt()]
        
        # Mock sleep to avoid long waits
        mock_sleep.return_value = None
        
        # Run main function; exit via KeyboardInterrupt side effect
        main()
        
        # Verify that no tasks were processed
        assert mock_get_pending_tasks.called
        assert mock_sleep.called

    @patch("main.get_pending_tasks")
    @patch("main.process_task")
    @patch("main.time.sleep")
    @patch("main.parse_arguments")
    def test_main_function_auto_shutdown_enabled(self, mock_parse_args, mock_sleep, mock_process_task, mock_get_pending_tasks):
        """Test main function with auto-shutdown enabled."""
        # Mock arguments
        mock_args = MagicMock()
        mock_args.auto_shutdown = True
        mock_parse_args.return_value = mock_args
        
        # First call returns tasks, second call returns empty (triggering auto-shutdown)
        mock_get_pending_tasks.side_effect = [
            [Task(id=1, title="Task 1", status=TaskStatus.PENDING, description=None, user_id=1, worker_id=None, started_at=None, completed_at=None, error_message=None, created_at="2024-01-01T00:00:00", updated_at="2024-01-01T00:00:00")],  # First call
            [],  # Second call - no tasks
            []   # Final check - still no tasks
        ]
        
        # Mock successful task processing
        mock_process_task.return_value = True
        
        # Mock sleep to avoid long waits
        mock_sleep.return_value = None
        
        # Run main function; it should break on its own after auto-shutdown
        main()
        
        # Verify auto-shutdown behavior
        assert mock_get_pending_tasks.call_count >= 2
        assert mock_process_task.called
        # Should have slept for auto-shutdown delay
        mock_sleep.assert_any_call(AUTO_SHUTDOWN_DELAY)

    @patch("main.get_pending_tasks")
    @patch("main.process_task")
    @patch("main.time.sleep")
    @patch("main.parse_arguments")
    def test_main_function_auto_shutdown_with_new_tasks(self, mock_parse_args, mock_sleep, mock_process_task, mock_get_pending_tasks):
        """Test auto-shutdown when new tasks appear during delay."""
        # Mock arguments
        mock_args = MagicMock()
        mock_args.auto_shutdown = True
        mock_parse_args.return_value = mock_args
        
        # First call returns tasks, second call returns empty, final check returns new tasks
        mock_get_pending_tasks.side_effect = [
            [Task(id=1, title="Task 1", status=TaskStatus.PENDING, description=None, user_id=1, worker_id=None, started_at=None, completed_at=None, error_message=None, created_at="2024-01-01T00:00:00", updated_at="2024-01-01T00:00:00")],  # First call
            [],  # Second call - no tasks
            [Task(id=2, title="Task 2", status=TaskStatus.PENDING, description=None, user_id=1, worker_id=None, started_at=None, completed_at=None, error_message=None, created_at="2024-01-01T00:00:00", updated_at="2024-01-01T00:00:00")],   # Final check - new tasks
            KeyboardInterrupt(),
        ]
        
        # Mock successful task processing
        mock_process_task.return_value = True
        
        # Mock sleep to avoid long waits
        mock_sleep.return_value = None
        
        # Run main function; exit via KeyboardInterrupt side effect after new tasks
        main()
        
        # Verify auto-shutdown was cancelled due to new tasks
        assert mock_get_pending_tasks.call_count >= 3
        assert mock_process_task.call_count >= 1

    @patch("main.get_pending_tasks")
    @patch("main.time.sleep")
    @patch("main.parse_arguments")
    def test_main_function_keyboard_interrupt(self, mock_parse_args, mock_sleep, mock_get_pending_tasks):
        """Test main function handling keyboard interrupt."""
        # Mock arguments
        mock_args = MagicMock()
        mock_args.auto_shutdown = False
        mock_parse_args.return_value = mock_args
        
        # Mock getting pending tasks to raise KeyboardInterrupt
        mock_get_pending_tasks.side_effect = KeyboardInterrupt()
        
        # Mock sleep to avoid long waits
        mock_sleep.return_value = None
        
        # Run main function
        main()  # Should handle KeyboardInterrupt gracefully
        
        # Verify it was called
        assert mock_get_pending_tasks.called

    @patch("main.get_pending_tasks")
    @patch("main.time.sleep")
    @patch("main.parse_arguments")
    def test_main_function_general_exception(self, mock_parse_args, mock_sleep, mock_get_pending_tasks):
        """Test main function handling general exceptions."""
        # Mock arguments
        mock_args = MagicMock()
        mock_args.auto_shutdown = False
        mock_parse_args.return_value = mock_args
        
        # Mock getting pending tasks to raise an exception
        mock_get_pending_tasks.side_effect = Exception("Test error")
        
        # Mock sleep to avoid long waits
        mock_sleep.return_value = None
        
        # Run main function - should raise the exception
        with pytest.raises(Exception, match="Test error"):
            main()
        
        # Verify it was called
        assert mock_get_pending_tasks.called

