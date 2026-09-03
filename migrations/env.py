from logging.config import fileConfig
import os

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from app import create_app
from app.extensions import db
from app.models import *


# Alembic Config object
config = context.config


# Setup logging if alembic.ini exists
if config.config_file_name is not None:
    if os.path.exists(config.config_file_name):
        fileConfig(config.config_file_name)


# SQLAlchemy metadata
target_metadata = db.metadata


def get_app():
    """
    Create Flask application instance.
    """
    return create_app()


def get_database_url():
    """
    Get database URL from Flask config.
    """

    app = get_app()

    return app.config.get(
        "SQLALCHEMY_DATABASE_URI"
    )


def run_migrations_offline():
    """
    Run migrations in 'offline' mode.
    """

    url = get_database_url()

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
    )

    with context.begin_transaction():
        context.run_migrations()



def run_migrations_online():
    """
    Run migrations in 'online' mode.
    """

    configuration = config.get_section(
        config.config_ini_section
    )

    configuration["sqlalchemy.url"] = get_database_url()


    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )


    with connectable.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )


        with context.begin_transaction():
            context.run_migrations()



if context.is_offline_mode():

    run_migrations_offline()

else:

    run_migrations_online()
