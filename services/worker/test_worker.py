#!/usr/bin/env python3
"""Test script for worker behavior."""

import time
import requests
import json

API_BASE_URL = "http://localhost:8000/api"


def create_test_user():
    """Create a test user."""
    user_data = {
        "username": "testworker",
        "email": "testworker@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/users/", json=user_data)
        if response.status_code == 201:
            user = response.json()
            print(f"Created test user: {user['username']} (ID: {user['id']})")
            return user
        else:
            print(f"Failed to create user: {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"Error creating user: {e}")
        return None


def create_test_task(user_id: int, title: str, description: str = None):
    """Create a test task."""
    task_data = {
        "title": title,
        "description": description or f"Test task: {title}",
        "user_id": user_id
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/tasks/", json=task_data)
        if response.status_code == 201:
            task = response.json()
            print(f"Created test task: {task['title']} (ID: {task['id']}, Status: {task['status']})")
            return task
        else:
            print(f"Failed to create task: {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"Error creating task: {e}")
        return None


def check_task_status(task_id: int):
    """Check the current status of a task."""
    try:
        response = requests.get(f"{API_BASE_URL}/tasks/{task_id}")
        if response.status_code == 200:
            task = response.json()
            print(f"Task {task_id} status: {task['status']}")
            if task.get('started_at'):
                print(f"  Started at: {task['started_at']}")
            if task.get('completed_at'):
                print(f"  Completed at: {task['completed_at']}")
            if task.get('worker_id'):
                print(f"  Worker ID: {task['worker_id']}")
            return task
        else:
            print(f"Failed to get task {task_id}: {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"Error getting task {task_id}: {e}")
        return None


def get_pending_tasks():
    """Get all pending tasks."""
    try:
        response = requests.get(f"{API_BASE_URL}/tasks/worker/pending")
        if response.status_code == 200:
            tasks = response.json()
            print(f"Found {len(tasks)} pending tasks:")
            for task in tasks:
                print(f"  - Task {task['id']}: {task['title']} (Status: {task['status']})")
            return tasks
        else:
            print(f"Failed to get pending tasks: {response.status_code}")
            return []
    except requests.RequestException as e:
        print(f"Error getting pending tasks: {e}")
        return []


def main():
    """Main test function."""
    print("=== Worker Behavior Test ===")
    print()
    
    # Check if API is running
    try:
        response = requests.get(f"{API_BASE_URL}/users/")
        if response.status_code != 200:
            print("❌ API is not responding. Make sure the API service is running.")
            return
        print("✅ API is responding")
    except requests.RequestException:
        print("❌ Cannot connect to API. Make sure the API service is running.")
        return
    
    print()
    
    # Create test user
    user = create_test_user()
    if not user:
        print("❌ Cannot proceed without a test user")
        return
    
    print()
    
    # Create test tasks
    tasks = []
    for i in range(3):
        task = create_test_task(user['id'], f"Test Task {i+1}")
        if task:
            tasks.append(task)
    
    if not tasks:
        print("❌ Cannot proceed without test tasks")
        return
    
    print()
    print(f"Created {len(tasks)} test tasks. Now start the worker in another terminal:")
    print("  cd services/worker && task run")
    print()
    print("The worker will poll for pending tasks every 10 seconds and process them one by one.")
    print("Each task will take 10 seconds to complete (WIP -> DONE).")
    print()
    
    # Monitor task status changes
    print("Monitoring task status changes...")
    print("Press Ctrl+C to stop monitoring")
    print()
    
    try:
        while True:
            print(f"\n--- Status Check at {time.strftime('%H:%M:%S')} ---")
            
            # Check pending tasks
            pending = get_pending_tasks()
            
            # Check status of all created tasks
            for task in tasks:
                check_task_status(task['id'])
                print()
            
            # Wait before next check
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n\nMonitoring stopped.")
        print("Check the worker logs to see the processing details.")


if __name__ == "__main__":
    main()
