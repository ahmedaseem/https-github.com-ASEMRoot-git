"""
ASEM Global Platform
Global Data API
"""

from flask import Blueprint, jsonify, request

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


# ============================================================
# PLATFORM PAGE API
# ============================================================

PAGE_DATA = {
    "tourism": {
        "title": "السياحة",
        "icon": "🌍",
        "content": "استكشف الوجهات السياحية والمدن والمعالم حول العالم."
    },
    "businesses": {
        "title": "الأعمال",
        "icon": "🏢",
        "content": "استكشف الشركات والأعمال والخدمات المتاحة على المنصة."
    },
    "products": {
        "title": "المنتجات",
        "icon": "🛍️",
        "content": "تصفح المنتجات والخدمات والفرص المتاحة."
    },
    "services": {
        "title": "الخدمات",
        "icon": "🛠️",
        "content": "اكتشف الخدمات التي توفرها منصة ASEM."
    },
    "projects": {
        "title": "المشروعات",
        "icon": "🏗️",
        "content": "استكشف المشروعات والمبادرات والمنشآت."
    },
    "portfolio": {
        "title": "أعمالنا",
        "icon": "💼",
        "content": "استعرض نماذج الأعمال والمشروعات المنفذة."
    },
    "about": {
        "title": "عن المنصة",
        "icon": "ℹ️",
        "content": "منصة ASEM العالمية للبيانات والخدمات والمشروعات."
    },
    "contact": {
        "title": "اتصل بنا",
        "icon": "📞",
        "content": "تواصل مع فريق منصة ASEM."
    },
    "search": {
        "title": "البحث",
        "icon": "🔎",
        "content": "ابحث داخل بيانات ومحتوى منصة ASEM."
    },
}


@api_bp.route(
    "/page/<string:page_name>",
    methods=["GET"]
)
def page(page_name):

    page_name = page_name.strip().lower()

    data = PAGE_DATA.get(page_name)

    if data is None:
        return jsonify(
            {
                "message": "Page not found",
                "page": page_name,
            }
        ), 404

    return jsonify(
        {
            "page": page_name,
            **data,
        }
    )


# ============================================================
# GPS / LOCATION API
# ============================================================

@api_bp.route(
    "/location",
    methods=["POST"]
)
def location():

    data = request.get_json(
        silent=True
    ) or {}

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    accuracy = data.get("accuracy")
    timestamp = data.get("timestamp")

    if latitude is None or longitude is None:
        return jsonify(
            {
                "success": False,
                "message": "latitude and longitude are required"
            }
        ), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

        if not (-90 <= latitude <= 90):
            raise ValueError("invalid latitude")

        if not (-180 <= longitude <= 180):
            raise ValueError("invalid longitude")

        if accuracy is not None:
            accuracy = float(accuracy)

    except (TypeError, ValueError):
        return jsonify(
            {
                "success": False,
                "message": "invalid location coordinates"
            }
        ), 400

    return jsonify(
        {
            "success": True,
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "accuracy": accuracy,
                "timestamp": timestamp
            }
        }
    ), 200
