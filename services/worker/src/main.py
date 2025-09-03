"""Main worker application."""

import argparse
import logging
import time
import uuid

from common.models import TaskStatus
from common.schemas import Task, TaskStatusUpdate
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Worker configuration
API_BASE_URL = "http://localhost:8000/api"
WORKER_ID = f"worker-{uuid.uuid4().hex[:8]}"
POLL_INTERVAL = 10  # seconds
AUTO_SHUTDOWN_DELAY = 5  # seconds to wait before auto-shutdown


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Task worker service")
    parser.add_argument(
        "--auto-shutdown",
        action="store_true",
        help="Auto-shutdown after completing at least one task and waiting 5 seconds with no pending tasks",
    )
    return parser.parse_args()


def update_task_status(task_id: int, status: TaskStatus, error_message: str = None) -> bool:
    """Update task status via API."""
    try:
        url = f"{API_BASE_URL}/tasks/{task_id}/status"

        # Use the shared Pydantic schema for status updates
        status_update = TaskStatusUpdate(status=status, worker_id=WORKER_ID, error_message=error_message)

        response = requests.put(url, json=status_update.model_dump())
        if response.status_code == 200:
            logger.info(f"Updated task {task_id} status to {status}")
            return True
        logger.error(f"Failed to update task {task_id} status: {response.status_code}")
        return False
    except requests.RequestException as e:
        logger.error(f"Error updating task {task_id} status: {e}")
        return False


def process_task(task: Task) -> bool:
    """Process a single task."""
    task_id = task.id
    task_title = task.title

    logger.info(f"Starting to process task {task_id}: {task_title}")

    try:
        # Set status to WIP
        if not update_task_status(task_id, TaskStatus.WIP):
            logger.error(f"Failed to set task {task_id} to WIP status")
            return False

        # Simulate work (await 10 seconds)
        logger.info(f"Task {task_id} is now WIP, working for 10 seconds...")
        time.sleep(10)

        # Set status to DONE
        if not update_task_status(task_id, TaskStatus.DONE):
            logger.error(f"Failed to set task {task_id} to DONE status")
            return False

        logger.info(f"Successfully completed task {task_id}: {task_title}")
        return True

    except Exception as e:
        logger.error(f"Error processing task {task_id}: {e}")
        # Set status to FAILED
        update_task_status(task_id, TaskStatus.FAILED, str(e))
        return False


def get_pending_tasks() -> list[Task]:
    """Get pending tasks from API."""
    try:
        response = requests.get(f"{API_BASE_URL}/tasks/worker/pending")
        if response.status_code == 200:
            tasks_data = response.json()
            # Parse the response into Task objects
            tasks = [Task.model_validate(task_data) for task_data in tasks_data]
            logger.info(f"Found {len(tasks)} pending tasks")
            return tasks
        logger.error(f"Failed to get pending tasks: {response.status_code}")
        return []
    except requests.RequestException as e:
        logger.error(f"Error getting pending tasks: {e}")
        return []
    except Exception as e:
        logger.error(f"Error parsing task data: {e}")
        return []


def main():
    """Main entry point."""
    args = parse_arguments()

    logger.info(f"Starting worker service with ID: {WORKER_ID}")
    logger.info(f"API Base URL: {API_BASE_URL}")
    logger.info(f"Poll interval: {POLL_INTERVAL} seconds")

    if args.auto_shutdown:
        logger.info(
            "Auto-shutdown mode enabled - will shutdown after completing tasks and waiting 5 seconds with no pending tasks"
        )

    # Database is managed by Alembic migrations
    logger.info("Database schema managed by Alembic migrations")

    # Auto-shutdown tracking variables
    has_completed_task = False
    consecutive_no_tasks_count = 0

    # Main loop
    try:
        while True:
            logger.info("Polling for pending tasks...")

            # Get pending tasks
            pending_tasks = get_pending_tasks()

            if pending_tasks:
                logger.info(f"Processing {len(pending_tasks)} pending tasks")
                consecutive_no_tasks_count = 0

                # Process tasks one by one (linearly)
                for task in pending_tasks:
                    logger.info(f"Processing task {task.id}: {task.title}")
                    success = process_task(task)

                    if success:
                        logger.info(f"Task {task.id} completed successfully")
                        has_completed_task = True
                    else:
                        logger.error(f"Task {task.id} failed")

                    # Small delay between tasks to avoid overwhelming the system
                    time.sleep(1)
            else:
                consecutive_no_tasks_count += 1
                logger.info(f"No pending tasks found (consecutive count: {consecutive_no_tasks_count})")

                # Check if we should auto-shutdown
                if args.auto_shutdown and has_completed_task and consecutive_no_tasks_count >= 1:
                    # Wait for the auto-shutdown delay
                    logger.info(
                        f"Auto-shutdown condition met. Waiting {AUTO_SHUTDOWN_DELAY} seconds before shutdown..."
                    )
                    time.sleep(AUTO_SHUTDOWN_DELAY)

                    # Check one more time for pending tasks
                    final_check = get_pending_tasks()
                    if not final_check:
                        logger.info("No pending tasks after final check. Auto-shutting down.")
                        break
                    logger.info(f"Found {len(final_check)} pending tasks after final check. Continuing...")
                    consecutive_no_tasks_count = 0

            # Wait before next poll
            logger.info(f"Waiting {POLL_INTERVAL} seconds before next poll...")
            time.sleep(POLL_INTERVAL)

    except KeyboardInterrupt:
        logger.info("Worker service stopped by user")
    except Exception as e:
        logger.error(f"Worker service error: {e}")
        raise


if __name__ == "__main__":
    main()
