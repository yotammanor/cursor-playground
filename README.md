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
│   └── tests/            # End-to-end tests with Playwright
├── packages/             # Shared backend libraries
│   └── common/           # Shared code between services
├── services/             # Server-side services
│   ├── api/              # FastAPI web service
│   │   ├── app/          # API implementation
│   │   └── tests/        # API unit tests
│   └── worker/           # Background worker service
└── devops/               # Infrastructure and deployment code
```

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite 5.x
- Tailwind CSS v4 (alpha)
- Shadcn UI (Component Library)
- React Query (Data fetching)
- React Router DOM (Routing)
- Vitest & React Testing Library (Unit testing)
- Playwright (End-to-end testing)

### Backend
- Python 3.10
- FastAPI (>0.109)
- Pydantic (>2.9)
- SQLAlchemy 1.3.x
- Pytest (Unit testing)

## UI Framework Decision

This project uses **Shadcn UI** with **Tailwind CSS v4** for the frontend. This decision was made for the following reasons:

1. **Modern Component Architecture**: Shadcn UI provides a collection of reusable components built on top of Radix UI primitives, offering excellent accessibility and customizability.

2. **Tailwind CSS v4 Benefits**: The latest version of Tailwind CSS offers improved performance, better developer experience, and new features while maintaining the utility-first approach.

3. **Headless Components**: Radix UI primitives provide unstyled, accessible components that handle complex interactions and accessibility concerns, allowing for complete styling control.

4. **Composition Over Configuration**: The component architecture encourages composition, making it easier to build complex UIs from simple building blocks.

5. **TypeScript Integration**: Strong TypeScript support for better developer experience and type safety.

## Setup Instructions

### Prerequisites
- Node.js 18.x
- Python 3.10
- Yarn 4.5.x
- uv 0.8.6
- Task.dev 3.44.1
- PostgreSQL (for database)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cursor-playground
   ```

2. **Install Task.dev** (if not already installed)
   ```bash
   # macOS
   brew install go-task
   
   # Or download from https://taskfile.dev/installation/
   ```

3. **Set up the entire development environment**
   ```bash
   task setup
   ```
   This command will:
   - Install all Python dependencies for common, API, and worker services
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
task app:dev

# API service only
task api:dev

# Worker service only
task worker:dev

# Common package development
task common:dev:install
```

#### Database Setup
```bash
# Set up database (PostgreSQL must be running)
task api:db:setup

# Run migrations
task api:db:migrate

# Create new migration
task api:db:create-migration -- "migration message"
```

#### Testing
```bash
# Run all tests
task test

# Run specific service tests
task app:test          # Frontend tests
task api:test          # API tests
task worker:test       # Worker tests
task common:test       # Common package tests

# Run tests with specific focus
task app:test:unit     # Frontend unit tests only
task app:test:e2e      # Frontend e2e tests
task app:test:api      # API e2e tests
```

#### Code Quality
```bash
# Lint and format all code
task lint
task format

# Fix linting issues automatically
task app:lint:fix      # Frontend
task api:lint          # API (includes auto-fix)
task worker:lint       # Worker (includes auto-fix)
task common:lint       # Common package (includes auto-fix)
```

#### Building
```bash
# Build all services for production
task build

# Build individual services
task app:build         # Frontend
task api:build         # API
task worker:build      # Worker
task common:build      # Common package
```

#### Development with Timeout
For development sessions with automatic shutdown:
```bash
# Start all services with 5-second timeout
task dev:timeout

# Start with custom timeout (in seconds)
task dev:timeout TIMEOUT=10

# Individual service timeouts
task app:dev:timeout TIMEOUT=5
task api:dev:timeout TIMEOUT=5
task worker:dev:timeout TIMEOUT=5
```

#### Troubleshooting
```bash
# Check development environment health
task doctor

# Clean build artifacts and caches
task clean

# Clean individual services
task app:clean
task api:clean
task worker:clean
task common:clean

# Clean install dependencies
task app:deps:clean    # Frontend
```

### Environment Variables

The project uses several environment variables that may need to be configured:

- `DATABASE_URL`: PostgreSQL connection string
- `CODEARTIFACT_AUTH_TOKEN`: AWS CodeArtifact authentication token (automatically retrieved)

### Available Tasks

Run `task --list` to see all available tasks, or `task help` for a quick overview.

### Notes

- The project uses **yarn** instead of npm for frontend dependency management
- Python dependencies are managed with **uv** for fast, reliable package management
- All services can be run independently or together using the main taskfile
- The `safe-start.sh` script ensures proper process management and port availability
