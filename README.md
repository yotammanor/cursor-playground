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
│   ├── web-api/          # FastAPI web service
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
