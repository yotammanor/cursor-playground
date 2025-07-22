"""Pydantic schemas shared between services."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema."""
    
    username: str
    email: EmailStr


class UserCreate(UserBase):
    """User creation schema."""
    
    password: str


class UserUpdate(BaseModel):
    """User update schema."""
    
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


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
    description: Optional[str] = None


class TaskCreate(TaskBase):
    """Task creation schema."""
    
    user_id: int


class TaskUpdate(BaseModel):
    """Task update schema."""
    
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class Task(TaskBase):
    """Task schema."""
    
    id: int
    is_completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic config."""
        
        from_attributes = True 