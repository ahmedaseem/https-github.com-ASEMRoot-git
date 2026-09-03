"""
ASEM Global Platform

Global Countries Seeder
"""

import json
import os

from app.extensions import db
from app.models import Country


BASE_DIR = os.path.dirname(__file__)

DATA_FILE = os.path.join(
    BASE_DIR,
    "data",
    "countries.json"
)


def seed_countries():

    with open(
        DATA_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        data = json.load(file)


    countries = data.get(
        "countries",
        []
    )


    created = 0
    skipped = 0


    for item in countries:

        exists = Country.query.filter_by(
            code=item["code"]
        ).first()


        if exists:
            skipped += 1
            continue


        country = Country(
            name=item["name"],
            code=item["code"],
            phone_code=item.get("phone_code"),
            currency=item.get("currency"),
            language=item.get("language"),
            description=item.get("description"),
            flag=item.get("flag")
        )


        db.session.add(country)

        created += 1


    db.session.commit()


    print(
        "Countries imported:",
        created
    )

    print(
        "Countries skipped:",
        skipped
    )

