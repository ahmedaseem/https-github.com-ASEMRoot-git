"""add projects model"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "968e7a575b95"
down_revision: Union[str, None] = "d254868fbe5d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("image", sa.String(255)),
        sa.Column("status", sa.String(100)),
        sa.Column("version", sa.String(50)),
        sa.Column("license", sa.String(50)),
        sa.Column("level", sa.String(50)),
        sa.Column("features", sa.JSON()),
        sa.Column("page", sa.String(255)),
        sa.Column("doc", sa.String(255)),
        sa.Column("download", sa.String(255)),
        sa.Column("github", sa.String(255)),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP")),
    )


def downgrade() -> None:
    op.drop_table("projects")
