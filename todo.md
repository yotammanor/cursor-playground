# Task Management Application - Progress Tracker

## Project Roadmap

### Phase 1: Development Environment and Tooling
- [x] Learn about uv (for python versions, venv and deps), https://taskfile.dev/, docker, and how to use them together. document in a dedicate file.
- [ ] Set up a local development environment of the backend services with `uv` and `Taskfile`.
- [ ] Set up reproducible builds for each service using `Docker` and `Taskfile`
- [ ] Make sure dev requirements are properly separated from production requirements
- [ ] Make sure common dependencies are properly shared between services
- [ ] Replace `npm` with `yarn` in the frontend setup
- [ ] Integrate `yarn` with the `Taskfile` for managing frontend dependencies and scripts
- [ ] Make sure all services can be run locally with a single command (e.g., `task dev`), alongside broker and database services
- [ ] Make sure all services can be built with a single command (e.g., `task build`)
- [ ] Configure `Taskfile` to:
  - [ ] Test all
  - [ ] Build all
  - [ ] Lint all
  - [ ] Deploy all

### Phase 2: Core Feature Implementation
- [ ] Make the worker and web-api services communicate via the broker, on simple tasks.
- [ ] Set up a broker for Celery (e.g., Redis or RabbitMQ) using docker, and integrate into local dev env.
- [ ] Track progress of tasks in the UI

### Phase 3: Automation and CI/CD
- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure workflows for building, testing, and deploying services - such that it calls on the taskfile to run the tests, build, and deploy

### Phase 4: Application Enhancement
- [ ] Add authentication and authorization
- [ ] Implement pagination for users and tasks lists
- [ ] Add sorting and filtering options
- [ ] Improve error handling and user feedback
- [ ] Add form validation with better user feedback


## Completed Tasks

### Project Setup
- [x] Scaffolded project structure based on README.md specifications
- [x] Created common service with shared models, schemas, and utilities
- [x] Implemented FastAPI web-api service with user and task endpoints
- [x] Set up Celery worker service with task processing capabilities
- [x] Created React frontend with TypeScript and Vite

### Frontend Development
- [x] Migrated from Chakra UI to Shadcn UI and Tailwind CSS v4
- [x] Updated README.md to document UI framework decision
- [x] Implemented React components for layout, navigation, and pages
- [x] Created user and task management interfaces
- [x] Set up React Router for navigation
- [x] Configured React Query for API data fetching
- [x] Added proper TypeScript types for all components and API responses

### Backend Development
- [x] Implemented SQLAlchemy models for User and Task entities
- [x] Created Pydantic schemas for data validation
- [x] Set up FastAPI endpoints for CRUD operations
- [x] Configured CORS to allow frontend requests (updated to support port 5174)
- [x] Implemented database initialization and connection management
- [x] Added utility functions for password hashing and validation

### Testing
- [x] Set up Playwright for end-to-end testing
- [x] Created navigation and search test scripts
- [x] Implemented and fixed user management flow test
- [x] Verified user creation, viewing, and deletion functionality

### Version Control
- [x] Initialized Git repository
- [x] Created .gitignore file
- [x] Made initial commit with all project files
- [x] Created remote GitHub repository (yotammanor/cursor-playground)
- [x] Pushed code to GitHub (including all previous changes)
