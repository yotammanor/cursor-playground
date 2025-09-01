"""Main FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routers import tasks, users

# Initialize FastAPI app
app = FastAPI(
    title="Task Management API",
    description="API for managing users and tasks",
    version="0.1.0",
    redirect_slashes=False,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Default Vite dev server
        "http://localhost:5174",  # Fallback Vite dev server
        "http://localhost:3000",  # Alternative dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])


@app.on_event("startup")
def startup_event():
    """Initialize database on startup."""


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Welcome to the Task Management API"}


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
