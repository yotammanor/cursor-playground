"""Main worker application."""

import logging
import time

from celery import Celery
from common.database import init_db
import requests

from worker.tasks import process_task, send_notification

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize Celery
celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

# Register tasks
celery_app.task(process_task)
celery_app.task(send_notification)


def poll_for_tasks():
    """Poll the API for new tasks."""
    try:
        response = requests.get("http://localhost:8000/api/tasks")
        if response.status_code == 200:
            tasks = response.json()
            for task in tasks:
                if not task["is_completed"]:
                    logger.info(f"Processing task: {task['id']} - {task['title']}")
                    process_task.delay(task["id"])
    except requests.RequestException as e:
        logger.error(f"Error polling for tasks: {e}")


def main():
    """Main entry point."""
    logger.info("Starting worker service...")

    # Initialize database
    init_db()
    logger.info("Database initialized")

    # Main loop
    try:
        while True:
            poll_for_tasks()
            time.sleep(60)  # Poll every minute
    except KeyboardInterrupt:
        logger.info("Worker service stopped")


if __name__ == "__main__":
    main()
