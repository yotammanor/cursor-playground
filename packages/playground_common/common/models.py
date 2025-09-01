"""SQLAlchemy models shared between services."""

import enum

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class TaskStatus(str, enum.Enum):
    """Task status enum."""

    PENDING = "pending"
    WIP = "wip"
    DONE = "done"
    FAILED = "failed"


class User(Base):
    """User model."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __str__(self):
        return f"User(id={self.id}, username='{self.username}')"


class Task(Base):
    """Task model."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True)
    description = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    worker_id = Column(String(100), nullable=True)  # Worker identifier
    started_at = Column(DateTime, nullable=True)  # When work started
    completed_at = Column(DateTime, nullable=True)  # When work completed
    error_message = Column(Text, nullable=True)  # Error details if failed
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __str__(self):
        return f"Task(id={self.id}, title='{self.title}', status='{self.status}')"
