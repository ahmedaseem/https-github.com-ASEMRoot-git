"""
ASEM Global Platform

Application Configuration
"""

import os
from dotenv import load_dotenv


load_dotenv()


class Config:
    """
    Base application configuration.
    """

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "change-this-in-production"
    )


    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///asem.db"
    )


    SQLALCHEMY_TRACK_MODIFICATIONS = False


    # JWT
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "change-jwt-secret"
    )


    # Uploads
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024


    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER",
        "uploads"
    )


    # Environment
    ENV = os.getenv(
        "FLASK_ENV",
        "production"
    )
