# Task Management Application - Progress Tracker


### Project Setup
- [x] Scaffolded project structure based on README.md specifications
- [x] Created common service with shared models, schemas, and utilities
- [x] Implemented FastAPI web-api service with user and task endpoints
- [x] Set up Celery worker service with task processing capabilities
- [x] Created React frontend with TypeScript and Vite
- [ ] Set up a broker for Celery (e.g., Redis or RabbitMQ) using docker

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

### Env Setup (local + build)

#### Backend Services
- [ ] Learn about uv (for python versions, venv and deps), https://taskfile.dev/, docker, and how to use them together
- [ ] Set up a local development environment with uv, Taskfile
- [ ] Set up a reproducible build for each service, using Docker and taskfile
- [ ] Make sure dev requirements are properly separated from production requirements
- [ ] Make sure common dependencies are properly shared between services
- [ ] Make sure all services can be run locally with a single command (e.g., `task dev`), alongside broker and database services
- [ ] Make sure all services can be built with a single command (e.g., `task build`)


#### Frontend

- [ ] Research how to replace npm with desired yarn
- [ ] replace `npm` with `yarn` in the frontend setup
- [ ] integrate `yarn` with the Taskfile for managing frontend dependencies and scripts

#### All together

- [ ] Make sure the Taskfile can run all services together, including the frontend, backend, broker, and database - this may need to be a composition of subpart taskfiles, if it is easily supported
- [ ] Make sure the Taskfile can:
  - [ ] Test all
  - [ ] Build all
  - [ ] Lint all
  - [ ] Deploy all

### CI/CD

- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure workflows for building, testing, and deploying services - such that it calls on the taskfile to run the tests, build, and deploy


## Features to complete

- [ ] Make the worker and web-api services communicate via the broker, on simple tasks.
- [ ] Track progress of tasks in the UI


### Future Work
- [ ] Add authentication and authorization
- [ ] Implement pagination for users and tasks lists
- [ ] Add sorting and filtering options
- [ ] Improve error handling and user feedback
- [ ] Add form validation with better user feedback
