"""
ASEM Global Platform

Authentication Token Service

Handles:
- Access tokens
- Refresh tokens
- Token identity
"""


from datetime import timedelta

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)



class TokenService:
    """
    JWT token management.
    """


    @staticmethod
    def create_tokens(user):
        """
        Generate access and refresh tokens.
        """


        identity = {
            "id": user.id,
            "email": user.email,
            "role": user.role.value
        }


        access_token = create_access_token(
            identity=identity,
            expires_delta=timedelta(
                hours=1
            )
        )


        refresh_token = create_refresh_token(
            identity=identity,
            expires_delta=timedelta(
                days=30
            )
        )


        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
