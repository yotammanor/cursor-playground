"""Pydantic schemas shared between services."""

from datetime import datetime

from pydantic import BaseModel, EmailStr

from common.models import TaskStatus


class UserBase(BaseModel):
    """Base user schema."""

    username: str
    email: EmailStr


class UserCreate(UserBase):
    """User creation schema."""

    password: str


class UserUpdate(BaseModel):
    """User update schema."""

    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    is_active: bool | None = None


class User(UserBase):
    """User schema."""

    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic config."""

        from_attributes = True


class TaskBase(BaseModel):
    """Base task schema."""

    title: str
    description: str | None = None


class TaskCreate(TaskBase):
    """Task creation schema."""

    user_id: int


class TaskUpdate(BaseModel):
    """Task update schema."""

    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
    worker_id: str | None = None
    error_message: str | None = None


class Task(TaskBase):
    """Task schema."""

    id: int
    status: TaskStatus
    user_id: int
    worker_id: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic config."""

        from_attributes = True


class TaskStatusUpdate(BaseModel):
    """Task status update schema for worker operations."""

    status: TaskStatus
    worker_id: str | None = None
    error_message: str | None = None
