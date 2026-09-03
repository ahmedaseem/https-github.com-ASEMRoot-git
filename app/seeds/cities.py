"""
ASEM Global Platform
Global Cities Seeder
"""

import json
import os

from app.extensions import db
from app.models import Country, City


BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "data", "cities.json")


def seed_cities():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    records = data.get("cities", [])

    created = 0
    skipped = 0

    for item in records:
        country_code = item.get("country_code")
        city_code = item.get("code")

        country = Country.query.filter_by(code=country_code).first()

        if not country:
            print(
                f"City skipped - country not found: "
                f"{item.get('name')} [{country_code}]"
            )
            skipped += 1
            continue

        exists = City.query.filter_by(code=city_code).first()

        if exists:
            skipped += 1
            continue

        city = City(
            country_id=country.id,
            name=item["name"],
            code=city_code,
            description=item.get("description"),
            image=item.get("image"),
            latitude=item.get("latitude"),
            longitude=item.get("longitude"),
            population=item.get("population"),
            is_active=item.get("is_active", True),
        )

        db.session.add(city)
        created += 1

    db.session.commit()

    print("Cities imported:", created)
    print("Cities skipped:", skipped)
