"""Worker tasks."""

import logging
import time
from typing import Any

from common.database import get_db
from common.models import Task, User

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def process_task(task_id: int) -> dict[str, Any]:
    """Process a task."""
    logger.info(f"Processing task {task_id}")

    # Simulate processing time
    time.sleep(5)

    # Update task status
    try:
        db = next(get_db())
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.is_completed = True
            db.commit()

            # Send notification
            user = db.query(User).filter(User.id == task.user_id).first()
            if user:
                send_notification(
                    user_id=user.id,
                    message=f"Task '{task.title}' has been completed",
                )

            return {"status": "success", "task_id": task_id}
        logger.error(f"Task {task_id} not found")
        return {"status": "error", "message": f"Task {task_id} not found"}
    except Exception as e:
        logger.error(f"Error processing task {task_id}: {e}")
        return {"status": "error", "message": str(e)}


def send_notification(user_id: int, message: str) -> dict[str, Any]:
    """Send a notification to a user."""
    logger.info(f"Sending notification to user {user_id}: {message}")

    # In a real application, this would send an email, push notification, etc.
    # For this example, we'll just log it

    # Simulate sending time
    time.sleep(1)

    return {
        "status": "success",
        "user_id": user_id,
        "message": message,
    }
