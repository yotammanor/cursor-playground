"""Utility functions shared between services."""

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional

from pydantic import EmailStr


def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    # In a real application, use a proper password hashing library like passlib or bcrypt
    salt = secrets.token_hex(8)
    return hashlib.sha256(f"{password}{salt}".encode()).hexdigest() + salt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against a provided password."""
    # In a real application, use a proper password hashing library like passlib or bcrypt
    salt = hashed_password[-16:]
    return hashlib.sha256(f"{plain_password}{salt}".encode()).hexdigest() + salt == hashed_password


def is_valid_email(email: str) -> bool:
    """Validate email format."""
    try:
        EmailStr.validate(email)
        return True
    except:
        return False


def format_datetime(dt: datetime) -> str:
    """Format datetime for display."""
    return dt.strftime("%Y-%m-%d %H:%M:%S") 