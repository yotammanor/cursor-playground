"""Database utilities shared between services."""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database configuration - would typically be loaded from environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# Create engine with SQLite-specific configuration
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite:///") else {}
    )
else:
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
