"""Remove redundant is_completed column.

Revision ID: 003
Revises: 002
Create Date: 2024-01-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Remove is_completed column from tasks table."""
    # Drop the is_completed column
    op.drop_column('tasks', 'is_completed')


def downgrade() -> None:
    """Add is_completed column back to tasks table."""
    # Add the is_completed column back
    op.add_column('tasks', sa.Column('is_completed', sa.Boolean(), nullable=True, default=False))
    
    # Set default values based on status
    op.execute("UPDATE tasks SET is_completed = 1 WHERE status = 'done'")
    op.execute("UPDATE tasks SET is_completed = 0 WHERE status != 'done'")
