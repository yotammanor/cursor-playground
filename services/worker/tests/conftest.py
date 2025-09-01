"""Pytest configuration and fixtures for worker service tests."""

import os

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from common.models import Base

# Alembic is used for integration DB schema parity
try:
    import alembic.config as alembic_config
    import alembic.command as alembic_command
    _ALEMBIC_AVAILABLE = True
except Exception:  # pragma: no cover - optional in unit-only runs
    _ALEMBIC_AVAILABLE = False


@pytest.fixture
def test_db():
    """Create a test database with in-memory SQLite."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Enable foreign key constraints for SQLite
    with engine.connect() as conn:
        conn.execute(text("PRAGMA foreign_keys = ON"))
    
    # Create a session
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="session")
def migrated_engine():
    """Provide a Postgres engine with Alembic migrations applied (integration tests).

    Requires a running Postgres instance. URL can be overridden via TEST_DATABASE_URL.
    Defaults to postgresql+psycopg2://postgres:postgres@localhost:5432/task_management_test
    """
    if not _ALEMBIC_AVAILABLE:
        pytest.skip("Alembic not available; install dev deps to run integration DB tests")

    db_url = os.getenv(
        "TEST_DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/task_management_test",
    )

    # Resolve Alembic config path relative to this file: services/api/alembic.ini
    alembic_ini_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "api", "alembic.ini")
    )

    # Create engine and verify connectivity early; skip if unavailable
    try:
        engine = create_engine(db_url, pool_pre_ping=True)
        with engine.connect() as _:
            pass
    except Exception as exc:  # pragma: no cover - environment dependent
        pytest.skip(f"Postgres test DB not available: {exc}")

    # Apply Alembic migrations to head for schema parity with production
    cfg = alembic_config.Config(alembic_ini_path)
    cfg.set_main_option("sqlalchemy.url", db_url)
    alembic_command.upgrade(cfg, "head")

    try:
        yield engine
    finally:
        engine.dispose()


@pytest.fixture
def pg_db(migrated_engine):
    """Function-scoped Session against migrated Postgres, wrapped in a transaction.

    Each test runs in a rolled-back transaction for isolation and speed.
    """
    connection = migrated_engine.connect()
    trans = connection.begin()
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=connection)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        trans.rollback()
        connection.close()

@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }


@pytest.fixture
def sample_task_data():
    """Sample task data for testing."""
    return {
        "title": "Test Task",
        "description": "This is a test task",
        "user_id": 1
    }
