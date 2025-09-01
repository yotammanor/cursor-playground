"""Main worker application."""

import logging
import time
import uuid
from datetime import datetime

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


def update_task_status(task_id: int, status: str, error_message: str = None) -> bool:
    """Update task status via API."""
    try:
        url = f"{API_BASE_URL}/tasks/{task_id}/status"
        data = {
            "status": status,
            "worker_id": WORKER_ID,
            "error_message": error_message
        }
        
        response = requests.put(url, json=data)
        if response.status_code == 200:
            logger.info(f"Updated task {task_id} status to {status}")
            return True
        else:
            logger.error(f"Failed to update task {task_id} status: {response.status_code}")
            return False
    except requests.RequestException as e:
        logger.error(f"Error updating task {task_id} status: {e}")
        return False


def process_task(task: dict) -> bool:
    """Process a single task."""
    task_id = task["id"]
    task_title = task["title"]
    
    logger.info(f"Starting to process task {task_id}: {task_title}")
    
    try:
        # Set status to WIP
        if not update_task_status(task_id, "wip"):
            logger.error(f"Failed to set task {task_id} to WIP status")
            return False
        
        # Simulate work (await 10 seconds)
        logger.info(f"Task {task_id} is now WIP, working for 10 seconds...")
        time.sleep(10)
        
        # Set status to DONE
        if not update_task_status(task_id, "done"):
            logger.error(f"Failed to set task {task_id} to DONE status")
            return False
        
        logger.info(f"Successfully completed task {task_id}: {task_title}")
        return True
        
    except Exception as e:
        logger.error(f"Error processing task {task_id}: {e}")
        # Set status to FAILED
        update_task_status(task_id, "failed", str(e))
        return False


def get_pending_tasks() -> list:
    """Get pending tasks from API."""
    try:
        response = requests.get(f"{API_BASE_URL}/tasks/worker/pending")
        if response.status_code == 200:
            tasks = response.json()
            logger.info(f"Found {len(tasks)} pending tasks")
            return tasks
        else:
            logger.error(f"Failed to get pending tasks: {response.status_code}")
            return []
    except requests.RequestException as e:
        logger.error(f"Error getting pending tasks: {e}")
        return []


def main():
    """Main entry point."""
    logger.info(f"Starting worker service with ID: {WORKER_ID}")
    logger.info(f"API Base URL: {API_BASE_URL}")
    logger.info(f"Poll interval: {POLL_INTERVAL} seconds")

    # Database is managed by Alembic migrations
    logger.info("Database schema managed by Alembic migrations")

    # Main loop
    try:
        while True:
            logger.info("Polling for pending tasks...")
            
            # Get pending tasks
            pending_tasks = get_pending_tasks()
            
            if pending_tasks:
                logger.info(f"Processing {len(pending_tasks)} pending tasks")
                
                # Process tasks one by one (linearly)
                for task in pending_tasks:
                    logger.info(f"Processing task {task['id']}: {task['title']}")
                    success = process_task(task)
                    
                    if success:
                        logger.info(f"Task {task['id']} completed successfully")
                    else:
                        logger.error(f"Task {task['id']} failed")
                    
                    # Small delay between tasks to avoid overwhelming the system
                    time.sleep(1)
            else:
                logger.info("No pending tasks found")
            
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
