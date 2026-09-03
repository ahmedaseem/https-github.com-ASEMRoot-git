"""
ASEM Global Platform
Global Database Seed Runner
"""

from app import create_app

from app.seeds.countries import seed_countries
from app.seeds.cities import seed_cities
from app.seeds.businesses import seed_businesses
from app.seeds.tourism import seed_tourism
from app.seeds.products import seed_products


def run():
    app = create_app()

    with app.app_context():

        print("=" * 60)
        print("ASEM Global Platform")
        print("Global Database Seed")
        print("=" * 60)

        print("\n[1/5] Countries")
        seed_countries()

        print("\n[2/5] Cities")
        seed_cities()

        print("\n[3/5] Businesses")
        seed_businesses()

        print("\n[4/5] Tourism")
        seed_tourism()

        print("\n[5/5] Products")
        seed_products()

        print("\n" + "=" * 60)
        print("Seed process completed successfully.")
        print("=" * 60)


if __name__ == "__main__":
    run()
