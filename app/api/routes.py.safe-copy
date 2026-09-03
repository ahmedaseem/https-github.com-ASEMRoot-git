"""
ASEM Global Platform
Global Data API
"""

from flask import Blueprint, jsonify

from app.models import (
    Country,
    City,
    Business,
    Tourism,
    Product,
    Project
)


api_bp = Blueprint(
    "api",
    __name__,
    url_prefix="/api"
)


@api_bp.route("/countries", methods=["GET"])
def countries():

    data = Country.query.all()

    return jsonify([
        item.to_dict()
        for item in data
    ])


@api_bp.route("/cities", methods=["GET"])
def cities():

    data = City.query.all()

    return jsonify([
        item.to_dict()
        for item in data
    ])


@api_bp.route("/businesses", methods=["GET"])
def businesses():

    data = Business.query.all()

    return jsonify([
        item.to_dict()
        for item in data
    ])


@api_bp.route("/tourism", methods=["GET"])
def tourism():

    data = Tourism.query.all()

    return jsonify([
        item.to_dict()
        for item in data
    ])


@api_bp.route("/products", methods=["GET"])
def products():

    data = Product.query.all()

    return jsonify([
        item.to_dict()
        for item in data
    ])


@api_bp.route("/projects", methods=["GET"])
def projects():

    data = Project.query.filter_by(
        is_active=True
    ).all()

    return jsonify([
        item.to_dict()
        for item in data
    ])
