"""
ASEM Global Platform
Global Tourism Seeder
"""

import json
import os

from app.extensions import db
from app.models import City, Tourism


BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "data", "tourism.json")


def seed_tourism():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    records = data.get("tourism", [])

    created = 0
    skipped = 0

    for item in records:
        city_code = item.get("city_code")

        city = City.query.filter_by(code=city_code).first()

        if not city:
            print(
                f"Tourism skipped - city not found: "
                f"{item.get('name')} [{city_code}]"
            )
            skipped += 1
            continue

        exists = Tourism.query.filter_by(
            city_id=city.id,
            name=item["name"]
        ).first()

        if exists:
            skipped += 1
            continue

        tourism = Tourism(
            city_id=city.id,
            name=item["name"],
            category=item["category"],
            description=item.get("description"),
            address=item.get("address"),
            image=item.get("image"),
            gallery=item.get("gallery", []),
            latitude=item.get("latitude"),
            longitude=item.get("longitude"),
            opening_hours=item.get("opening_hours"),
            ticket_price=item.get("ticket_price"),
            rating=item.get("rating", 0),
            verified=item.get("verified", False),
            is_active=item.get("is_active", True),
        )

        db.session.add(tourism)
        created += 1

    db.session.commit()

    print("Tourism imported:", created)
    print("Tourism skipped:", skipped)
