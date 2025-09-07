# Task Management Application

A full-stack task management application with a React frontend and Python microservices backend.

## Project Structure

```
.
├── app/                  # Client-side React application
│   ├── src/              # React source code
│   │   ├── api/          # API client functions
│   │   ├── components/   # Reusable UI components
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript type definitions
│   └── tests/            # Unit tests with Vitest
├── packages/             # Shared backend libraries
│   └── playground_common/ # Shared code between services
├── services/             # Server-side services
│   ├── api/              # FastAPI web service
│   │   ├── src/          # API implementation
│   │   └── tests/        # API unit tests
│   └── worker/           # Background worker service
├── e2e/                  # End-to-end tests (planned with Playwright)
└── devops/               # Infrastructure and deployment code
```

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite 7.x
- Tailwind CSS v4
- Shadcn UI (Component Library)
- TanStack Query (Data fetching)
- React Router DOM v7 (Routing)
- Vitest & React Testing Library (Unit testing)
- Playwright (End-to-end testing - planned)

### Backend
- Python 3.10
- FastAPI (>=0.109)
- Pydantic (>=2.11)
- SQLAlchemy (>=1.3,<1.4)
- Alembic (Database migrations)
- Pytest (Unit testing)
- Ruff (Linting and formatting)

## Setup Instructions

### Prerequisites
- Node.js 22.x
- Python 3.10
- Yarn 4.5.x
- uv 0.8.6
- Task.dev 3.44.1

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cursor-playground
   ```

2. **Install Task.dev** (if not already installed)
   ```bash
   brew install go-task uv
      ```

3. **Set up the entire development environment**
   ```bash
   task setup
   ```
   This command will:
   - Install all Python dependencies for api and worker services
   - Install all Node.js dependencies for the frontend
   - Set up development dependencies where needed

4. **Start all services for development**
   ```bash
   task dev
   ```
   This will start:
   - Frontend development server (port 5174)
   - API service (port 8000)
   - Worker service
   - All services with hot-reload enabled

### Development Workflow

#### Starting Individual Services
```bash
# Frontend only
cd app && task run

# API service only
cd services/api && task run

# Worker service only
cd services/worker && task run

```


#### Testing
```bash
# Run all tests
task test

# Run frontend unit tests
cd app && task test

# Run backend unit tests
cd services/api && task test
cd services/worker && task test
```

#### Code Quality
```bash
# Lint and format all code
task lint
task format
```

#### Build & Deploy
```bash
# Build all services for production
task build
```
Deploy - TBD
