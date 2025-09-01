"""Pytest configuration and fixtures for web API tests."""

from fastapi.testclient import TestClient
import pytest

from src.main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)
