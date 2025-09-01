"""Enhance tasks table for worker behavior.

Revision ID: 002
Revises: 001
Create Date: 2024-01-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add new columns to tasks table."""
    # Add new columns for worker behavior
    op.add_column('tasks', sa.Column('status', sa.String(20), nullable=True))
    op.add_column('tasks', sa.Column('worker_id', sa.String(100), nullable=True))
    op.add_column('tasks', sa.Column('started_at', sa.DateTime(), nullable=True))
    op.add_column('tasks', sa.Column('completed_at', sa.DateTime(), nullable=True))
    op.add_column('tasks', sa.Column('error_message', sa.Text(), nullable=True))
    
    # Set default status for existing tasks
    op.execute("UPDATE tasks SET status = 'pending' WHERE status IS NULL")
    
    # Create index on status for better query performance
    op.create_index(op.f('ix_tasks_status'), 'tasks', ['status'], unique=False)


def downgrade() -> None:
    """Remove new columns from tasks table."""
    # Drop index
    op.drop_index(op.f('ix_tasks_status'), table_name='tasks')
    
    # Drop columns
    op.drop_column('tasks', 'error_message')
    op.drop_column('tasks', 'completed_at')
    op.drop_column('tasks', 'started_at')
    op.drop_column('tasks', 'worker_id')
    op.drop_column('tasks', 'status')
