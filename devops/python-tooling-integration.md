# Modern Python Development Environment (2025)

This document outlines how we'll integrate **uv**, **Taskfile.dev**, and **Docker** to create an efficient development environment for our task management application.

## Project Structure Understanding

Our project has the following key components:

1. **Common Package** (`services/common/`): A shared library package that provides common functionality used by both backend services. It's not a standalone service but is installed as a dependency.

2. **Web API Service** (`services/web-api/`): A FastAPI application that provides REST endpoints for the frontend.

3. **Worker Service** (`services/worker/`): A Celery worker that processes background tasks.

4. **Frontend Application** (`app/`): A React application that provides the user interface.

## Core Tools Overview

### uv

**uv** is a blazing-fast Python package manager written in Rust that replaces pip, virtualenv, and other tools.

**Key benefits:**
- 10-100x faster dependency resolution than pip
- Built-in Python version management
- Lockfile-based reproducibility with `uv.lock`
- Virtual environment management
- Tool running without global installation

### Taskfile.dev

**Taskfile** is a modern task runner that uses YAML instead of Makefile syntax, making it cross-platform and more maintainable.

**Key benefits:**
- Cross-platform (works on Windows without WSL)
- YAML-based configuration (no tab issues like Make)
- Rich templating and variable system
- Task dependencies and includes for modular organization
- File-watching capabilities

### Docker

**Docker** provides containerization for consistent environments across testing and production (not for local development).

**Key benefits:**
- Environment isolation and reproducibility for CI/CD and production
- Multi-stage builds for optimized images
- Simplified service orchestration for production deployments
- Consistent behavior across testing and production environments

## Integration Strategy

### 1. Python Environment Management with uv

We'll use uv to:
- Manage Python versions for each service
- Create and manage virtual environments
- Install dependencies from `pyproject.toml` (migrated from requirements.txt)
- Generate and use lock files for reproducibility
- Run development tools without global installation
- Install the common package in editable mode for local development

**Example commands:**
```bash
# Install specific Python version
uv python install 3.10

# Create virtual environment with specific Python
uv venv --python 3.10

# Install dependencies from pyproject.toml
uv sync

# Run tools without global installation
uv run pytest
uv run ruff check .

# Install common package in editable mode
uv pip install -e ../common
```

### 2. Task Automation with Taskfile

We'll create Taskfiles at multiple levels:
- Root Taskfile for project-wide commands
- Service-specific Taskfiles for backend services
- Frontend Taskfile for the React application

**Root Taskfile.yml example:**
```yaml
version: '3'

includes:
  web-api: ./services/web-api/Taskfile.yml
  worker: ./services/worker/Taskfile.yml
  app: ./app/Taskfile.yml

tasks:
  setup:
    desc: Set up the entire development environment
    cmds:
      - task: setup-common
      - task: web-api:setup
      - task: worker:setup
      - task: app:setup

  setup-common:
    desc: Set up the common package
    dir: ./services/common
    cmds:
      - uv python install 3.10
      - uv venv
      - uv pip install -e .

  dev:
    desc: Start all services for development
    cmds:
      - task: web-api:dev
      - task: worker:dev
      - task: app:dev

  test:
    desc: Run all tests
    cmds:
      - task: web-api:test
      - task: worker:test
      - task: app:test

  lint:
    desc: Lint all code
    cmds:
      - task: web-api:lint
      - task: worker:lint
      - task: app:lint
```

**Service Taskfile.yml example (web-api):**
```yaml
version: '3'

vars:
  PYTHON_VERSION: "3.10"

tasks:
  setup:
    desc: Set up the web-api development environment
    cmds:
      - uv python install {{.PYTHON_VERSION}}
      - uv venv
      - uv pip install -e .
      - uv pip install -e ../../common  # Install common package in editable mode

  dev:
    desc: Start the web-api service
    cmds:
      - uv run uvicorn app.main:app --reload --port 8000

  test:
    desc: Run web-api tests
    cmds:
      - uv run pytest tests/

  lint:
    desc: Lint web-api code
    cmds:
      - uv run ruff check .
      - uv run ruff format --check .
```

**Worker Taskfile.yml example:**
```yaml
version: '3'

vars:
  PYTHON_VERSION: "3.10"

tasks:
  setup:
    desc: Set up the worker development environment
    cmds:
      - uv python install {{.PYTHON_VERSION}}
      - uv venv
      - uv pip install -e .
      - uv pip install -e ../../common  # Install common package in editable mode

  dev:
    desc: Start the worker service
    cmds:
      - uv run python -m worker.main
```

### 3. Docker for Testing and Production (Not Local Development)

We'll use Docker for:
- Consistent testing environments in CI/CD
- Production-ready images
- Service orchestration in production

**Multi-stage Dockerfile example:**
```dockerfile
# Build stage
FROM python:3.10-slim AS builder

# Install uv
RUN pip install --no-cache-dir uv

# Set working directory
WORKDIR /app

# Copy dependency files for layer caching
COPY pyproject.toml uv.lock ./

# Copy common package
COPY --from=common-builder /app/common /app/common

# Install dependencies
RUN uv sync --frozen --no-install-project

# Copy application code
COPY . .

# Install the project
RUN uv sync --frozen

# Runtime stage
FROM python:3.10-slim AS runtime

# Copy the virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY --from=builder /app /app

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app"

# Set working directory
WORKDIR /app

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

## Implementation Plan

1. **Migrate to Modern Python Project Structure**
   - Convert requirements.txt to pyproject.toml for each service
   - Create uv.lock files for reproducible dependencies
   - Configure Python version management

2. **Set Up Local Development Environment**
   - Create Taskfiles for each component
   - Configure local development tasks (no Docker)
   - Set up common package installation in editable mode

3. **Configure Docker for CI/CD and Production**
   - Create optimized Dockerfiles for each service
   - Set up docker-compose.yml for production deployment

4. **Establish CI/CD pipeline**
   - Create GitHub Actions workflow using Taskfiles
   - Configure automated testing and deployment

## Best Practices

1. **Dependency Management**
   - Use lock files for reproducibility
   - Separate dev and production dependencies
   - Pin Python versions explicitly
   - Install common package in editable mode for local development

2. **Local Development**
   - Run services natively (not in Docker)
   - Use uv for dependency management and tool running
   - Use Taskfile for task automation
   - Configure proper environment variables for local development

3. **Task Organization**
   - Group related tasks logically
   - Use includes for modularity
   - Document tasks with descriptions

4. **Environment Configuration**
   - Use .env files for local configuration
   - Use environment variables for service configuration
   - Keep secrets out of version control