"""add user_id to job_analysis_ai

Revision ID: a1b2c3d4e5f6
Revises: 7d899a56612d
Create Date: 2026-03-07 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '7d899a56612d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('job_analysis_ai', sa.Column('user_id', sa.String(), nullable=True))
    op.create_index(op.f('ix_job_analysis_ai_user_id'), 'job_analysis_ai', ['user_id'], unique=False)
    op.create_foreign_key('fk_job_analysis_ai_user_id', 'job_analysis_ai', 'users', ['user_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('fk_job_analysis_ai_user_id', 'job_analysis_ai', type_='foreignkey')
    op.drop_index(op.f('ix_job_analysis_ai_user_id'), table_name='job_analysis_ai')
    op.drop_column('job_analysis_ai', 'user_id')
