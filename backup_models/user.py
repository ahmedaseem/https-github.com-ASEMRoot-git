"""
ASEM Global Platform

User Authentication Model

Handles:
- Users
- Roles
- Security fields
- Account status
"""


from datetime import datetime
from enum import Enum

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from app.extensions import db



class UserRole(Enum):
    """
    Available system roles.
    """

    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    BUSINESS_OWNER = "business_owner"
    USER = "user"



class UserStatus(Enum):
    """
    Account states.
    """

    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"



class User(db.Model):
    """
    Main User Account Model.
    """

    __tablename__ = "users"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    full_name = db.Column(
        db.String(150),
        nullable=False
    )


    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False,
        index=True
    )


    username = db.Column(
        db.String(100),
        unique=True,
        nullable=False,
        index=True
    )


    password_hash = db.Column(
        db.String(255),
        nullable=False
    )


    role = db.Column(
        db.Enum(UserRole),
        nullable=False,
        default=UserRole.USER
    )


    status = db.Column(
        db.Enum(UserStatus),
        nullable=False,
        default=UserStatus.PENDING
    )


    is_verified = db.Column(
        db.Boolean,
        default=False
    )


    last_login = db.Column(
        db.DateTime,
        nullable=True
    )


    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


    def set_password(self, password):
        """
        Hash and store user password.
        """

        self.password_hash = generate_password_hash(
            password
        )


    def check_password(self, password):
        """
        Verify password.
        """

        return check_password_hash(
            self.password_hash,
            password
        )


    def __repr__(self):

        return f"<User {self.email}>"
