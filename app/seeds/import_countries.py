"""
ASEM Global Platform

Global Countries Importer

Imports ISO 3166 country dataset
into database.
"""

import json
import os

from app import create_app
from app.extensions import db
from app.models import Country


BASE_DIR = os.path.dirname(__file__)

DATA_FILE = os.path.join(
    BASE_DIR,
    "data",
    "countries_source.json"
)

def import_countries():

    app = create_app()

    with app.app_context():

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
        updated = 0
        skipped = 0


        for item in countries:

            code = item.get("code")


            if not code:
                skipped += 1
                continue


            country = Country.query.filter_by(
                code=code
            ).first()


            if country:

                country.name = item.get(
                    "name",
                    country.name
                )

                country.phone_code = item.get(
                    "phone_code"
                )

                country.currency = item.get(
                    "currency"
                )

                country.language = item.get(
                    "language"
                )

                country.description = item.get(
                    "description"
                )

                country.flag = item.get(
                    "flag"
                )

                updated += 1


            else:

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


        print("Countries created:", created)
        print("Countries updated:", updated)
        print("Countries skipped:", skipped)



if __name__ == "__main__":
    import_countries()
