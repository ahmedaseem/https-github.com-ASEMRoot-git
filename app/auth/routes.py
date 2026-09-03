"""
ASEM Global Platform

Authentication API Routes

Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
"""


from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token
)


from app.auth.services import AuthService
from app.auth.tokens import TokenService
from app.models import UserRole



auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)



@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():

    data = request.get_json()


    user = AuthService.create_user(
        full_name=data.get("full_name"),
        email=data.get("email"),
        username=data.get("username"),
        password=data.get("password")
    )


    return jsonify(
        {
            "message": "User created successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role.value
            }
        }
    ), 201




@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.get_json()


    user = AuthService.authenticate(
        login=data.get("login"),
        password=data.get("password")
    )


    if not user:

        return jsonify(
            {
                "message": "Invalid credentials"
            }
        ), 401



    tokens = TokenService.create_tokens(
        user
    )


    return jsonify(
        {
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role.value
            },
            **tokens
        }
    )




@auth_bp.route(
    "/refresh",
    methods=["POST"]
)
@jwt_required(
    refresh=True
)
def refresh():

    identity = get_jwt_identity()


    new_access_token = create_access_token(
        identity=identity
    )


    return jsonify(
        {
            "access_token": new_access_token
        }
    )
