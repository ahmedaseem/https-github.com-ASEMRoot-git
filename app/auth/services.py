"""
ASEM Global Platform

Authentication Services

Handles:
- User creation
- Password validation
- User lookup
- Login logic
"""


from datetime import datetime

from app.extensions import db
from app.models import User, UserRole, UserStatus



class AuthService:
    """
    Authentication business logic.
    """


    @staticmethod
    def create_user(
        full_name,
        email,
        username,
        password,
        role=UserRole.USER
    ):
        """
        Create a new user account.
        """


        existing_email = User.query.filter_by(
            email=email
        ).first()


        if existing_email:
            raise ValueError(
                "Email already exists"
            )


        existing_username = User.query.filter_by(
            username=username
        ).first()


        if existing_username:
            raise ValueError(
                "Username already exists"
            )


        user = User(
            full_name=full_name,
            email=email,
            username=username,
            role=role,
            status=UserStatus.ACTIVE
        )


        user.set_password(
            password
        )


        db.session.add(user)

        db.session.commit()


        return user



    @staticmethod
    def authenticate(
        login,
        password
    ):
        """
        Authenticate user by email or username.
        """


        user = User.query.filter(
            (User.email == login) |
            (User.username == login)
        ).first()


        if not user:
            return None


        if not user.check_password(
            password
        ):
            return None


        user.last_login = datetime.utcnow()

        db.session.commit()


        return user



    @staticmethod
    def get_user_by_id(user_id):
        """
        Get user by primary key.
        """

        return User.query.get(
            user_id
        )
