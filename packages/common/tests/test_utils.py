"""Tests for utility functions."""

import pytest
from datetime import datetime

from common.utils import (
    get_password_hash,
    verify_password,
    is_valid_email,
    format_datetime
)


class TestPasswordUtils:
    """Test password-related utility functions."""

    def test_get_password_hash(self):
        """Test password hashing."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        # Check that the hash is different from the original password
        assert hashed != password
        
        # Check that the hash is a string
        assert isinstance(hashed, str)
        
        # Check that the hash has the expected length (64 chars for SHA256 + 16 chars for salt)
        assert len(hashed) == 80

    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        password = "testpassword123"
        wrong_password = "wrongpassword"
        hashed = get_password_hash(password)
        
        assert verify_password(wrong_password, hashed) is False

    def test_verify_password_empty(self):
        """Test password verification with empty password."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert verify_password("", hashed) is False

    def test_password_hash_consistency(self):
        """Test that password hashing produces different hashes for the same password."""
        password = "testpassword123"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        # Hashes should be different due to different salts
        assert hash1 != hash2
        
        # But both should verify correctly
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True


class TestEmailUtils:
    """Test email validation utility functions."""

    def test_is_valid_email_valid(self):
        """Test valid email addresses."""
        valid_emails = [
            "test@example.com",
            "user.name@domain.co.uk",
            "user+tag@example.org",
            "123@numbers.com",
            "user@subdomain.example.com"
        ]
        
        for email in valid_emails:
            assert is_valid_email(email) is True

    def test_is_valid_email_invalid(self):
        """Test invalid email addresses."""
        invalid_emails = [
            "invalid-email",
            "@example.com",
            "user@",
            "user@.com",
            "user..name@example.com",
            "user@example..com",
            "",
            "no-at-sign",
            "user@example",
            "user name@example.com"
        ]
        
        for email in invalid_emails:
            assert is_valid_email(email) is False

    def test_is_valid_email_edge_cases(self):
        """Test edge cases for email validation."""
        # None should be invalid
        assert is_valid_email(None) is False
        
        # Very long email
        long_email = "a" * 100 + "@example.com"
        assert is_valid_email(long_email) is True


class TestDateTimeUtils:
    """Test datetime formatting utility functions."""

    def test_format_datetime(self):
        """Test datetime formatting."""
        dt = datetime(2023, 12, 25, 14, 30, 45)
        formatted = format_datetime(dt)
        
        assert formatted == "2023-12-25 14:30:45"

    def test_format_datetime_with_microseconds(self):
        """Test datetime formatting with microseconds."""
        dt = datetime(2023, 12, 25, 14, 30, 45, 123456)
        formatted = format_datetime(dt)
        
        # Should ignore microseconds
        assert formatted == "2023-12-25 14:30:45"

    def test_format_datetime_edge_cases(self):
        """Test datetime formatting edge cases."""
        # Test with different times
        dt1 = datetime(2023, 1, 1, 0, 0, 0)
        assert format_datetime(dt1) == "2023-01-01 00:00:00"
        
        dt2 = datetime(2023, 12, 31, 23, 59, 59)
        assert format_datetime(dt2) == "2023-12-31 23:59:59"

    def test_format_datetime_returns_string(self):
        """Test that format_datetime returns a string."""
        dt = datetime.now()
        formatted = format_datetime(dt)
        
        assert isinstance(formatted, str)
        assert len(formatted) == 19  # YYYY-MM-DD HH:MM:SS format
