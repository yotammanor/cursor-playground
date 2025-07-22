# Worker Service

A background worker service for processing tasks asynchronously.

## Setup

```bash
# Create virtual environment
mkvirtualenv worker

# Install dependencies
pip install -e ../common
pip install -r requirements.txt

# Run the worker
python -m worker.main
```

## Dependencies

- Redis (for Celery)

Make sure Redis is running locally on the default port (6379) or update the connection details in `worker/main.py`.

## Tasks

The worker service processes the following tasks:

- **Task Processing**: Processes tasks marked as incomplete and updates their status
- **Notifications**: Sends notifications to users when their tasks are completed

## Architecture

This worker service polls the web API periodically for new tasks and processes them asynchronously using Celery. 