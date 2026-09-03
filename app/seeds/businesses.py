"""
ASEM Global Platform
Global Businesses Seeder
"""

import json
import os

from app.extensions import db
from app.models import City, Business


BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "data", "businesses.json")


def seed_businesses():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    records = data.get("businesses", [])

    created = 0
    skipped = 0

    for item in records:
        city_code = item.get("city_code")

        city = City.query.filter_by(code=city_code).first()

        if not city:
            print(
                f"Business skipped - city not found: "
                f"{item.get('name')} [{city_code}]"
            )
            skipped += 1
            continue

        exists = Business.query.filter_by(
            city_id=city.id,
            name=item["name"]
        ).first()

        if exists:
            skipped += 1
            continue

        business = Business(
            city_id=city.id,
            name=item["name"],
            category=item["category"],
            description=item.get("description"),
            address=item.get("address"),
            phone=item.get("phone"),
            email=item.get("email"),
            website=item.get("website"),
            logo=item.get("logo"),
            cover_image=item.get("cover_image"),
            rating=item.get("rating", 0),
            verified=item.get("verified", False),
            is_active=item.get("is_active", True),
        )

        db.session.add(business)
        created += 1

    db.session.commit()

    print("Businesses imported:", created)
    print("Businesses skipped:", skipped)
