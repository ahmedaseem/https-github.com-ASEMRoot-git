"""
ASEM Global Platform
Global Platform Seed

Creates production-ready demonstration data for:
- Cities
- Tourism
- Businesses
- Products

The seed is idempotent and safe to run repeatedly.
"""

from app.extensions import db
from app.models import (
    Country,
    City,
    Tourism,
    Business,
    Product,
)


CITIES = [
    {
        "country": "US",
        "name": "New York",
        "code": "NYC",
        "description": "Global business, technology, culture and tourism hub.",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "population": 8804190,
    },
    {
        "country": "GB",
        "name": "London",
        "code": "LON",
        "description": "Global centre for business, finance, culture and tourism.",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "population": 8982000,
    },
    {
        "country": "FR",
        "name": "Paris",
        "code": "PAR",
        "description": "International centre for culture, tourism, fashion and business.",
        "latitude": 48.8566,
        "longitude": 2.3522,
        "population": 2161000,
    },
    {
        "country": "JP",
        "name": "Tokyo",
        "code": "TYO",
        "description": "Major global technology, business and cultural destination.",
        "latitude": 35.6762,
        "longitude": 139.6503,
        "population": 14094000,
    },
    {
        "country": "AE",
        "name": "Dubai",
        "code": "DXB",
        "description": "International destination for business, tourism and innovation.",
        "latitude": 25.2048,
        "longitude": 55.2708,
        "population": 3522000,
    },
    {
        "country": "EG",
        "name": "Cairo",
        "code": "CAI",
        "description": "Major African and Middle Eastern centre of culture, history and commerce.",
        "latitude": 30.0444,
        "longitude": 31.2357,
        "population": 10230000,
    },
    {
        "country": "DE",
        "name": "Berlin",
        "code": "BER",
        "description": "European technology, culture and startup hub.",
        "latitude": 52.5200,
        "longitude": 13.4050,
        "population": 3769000,
    },
    {
        "country": "SG",
        "name": "Singapore",
        "code": "SIN",
        "description": "Global technology, finance, logistics and business hub.",
        "latitude": 1.3521,
        "longitude": 103.8198,
        "population": 5921000,
    },
]


TOURISM = [
    {
        "city": "New York",
        "name": "Central Park",
        "category": "Nature & Parks",
        "description": "One of the world's most recognized urban parks.",
        "address": "Central Park, New York, USA",
        "latitude": 40.7829,
        "longitude": -73.9654,
        "rating": 4.8,
        "verified": True,
    },
    {
        "city": "London",
        "name": "Tower of London",
        "category": "Historic Sites",
        "description": "Historic fortress and landmark on the River Thames.",
        "address": "London, United Kingdom",
        "latitude": 51.5081,
        "longitude": -0.0759,
        "rating": 4.7,
        "verified": True,
    },
    {
        "city": "Paris",
        "name": "Eiffel Tower",
        "category": "Landmarks",
        "description": "Iconic Paris landmark and one of the world's most visited attractions.",
        "address": "Champ de Mars, Paris, France",
        "latitude": 48.8584,
        "longitude": 2.2945,
        "rating": 4.9,
        "verified": True,
    },
    {
        "city": "Tokyo",
        "name": "Tokyo Skytree",
        "category": "Landmarks",
        "description": "Major Tokyo landmark offering panoramic views of the city.",
        "address": "Sumida, Tokyo, Japan",
        "latitude": 35.7101,
        "longitude": 139.8107,
        "rating": 4.7,
        "verified": True,
    },
    {
        "city": "Dubai",
        "name": "Burj Khalifa",
        "category": "Landmarks",
        "description": "World-famous skyscraper and major Dubai attraction.",
        "address": "Downtown Dubai, UAE",
        "latitude": 25.1972,
        "longitude": 55.2744,
        "rating": 4.9,
        "verified": True,
    },
    {
        "city": "Cairo",
        "name": "Giza Pyramids",
        "category": "Historic Sites",
        "description": "Ancient monumental complex and one of the world's greatest archaeological destinations.",
        "address": "Giza, Egypt",
        "latitude": 29.9792,
        "longitude": 31.1342,
        "rating": 4.9,
        "verified": True,
    },
]


BUSINESSES = [
    {
        "city": "New York",
        "name": "ASEM Global Consulting",
        "category": "Technology",
        "description": "Digital transformation and software solutions for modern businesses.",
        "address": "New York, USA",
        "website": "https://asemdigital.github.io/",
        "rating": 4.9,
        "verified": True,
    },
    {
        "city": "London",
        "name": "ASEM London Solutions",
        "category": "Software",
        "description": "Business software, automation and digital platform services.",
        "address": "London, United Kingdom",
        "website": "https://asemdigital.github.io/",
        "rating": 4.8,
        "verified": True,
    },
    {
        "city": "Paris",
        "name": "ASEM Paris Digital",
        "category": "Digital Services",
        "description": "Web development, cloud solutions and digital consulting.",
        "address": "Paris, France",
        "website": "https://asemdigital.github.io/",
        "rating": 4.8,
        "verified": True,
    },
    {
        "city": "Dubai",
        "name": "ASEM Gulf Technology",
        "category": "Technology",
        "description": "Enterprise technology and digital infrastructure solutions.",
        "address": "Dubai, UAE",
        "website": "https://asemdigital.github.io/",
        "rating": 4.9,
        "verified": True,
    },
]


PRODUCTS = [
    {
        "business": "ASEM Global Consulting",
        "name": "Business Website Package",
        "category": "Web Development",
        "description": "Professional responsive website package for businesses.",
        "price": 499.00,
        "currency": "USD",
        "sku": "ASEM-WEB-001",
        "rating": 4.9,
        "stock": 100,
    },
    {
        "business": "ASEM Global Consulting",
        "name": "AI Automation Package",
        "category": "AI & Automation",
        "description": "Automation solution designed to improve business workflows.",
        "price": 999.00,
        "currency": "USD",
        "sku": "ASEM-AI-001",
        "rating": 4.8,
        "stock": 50,
    },
    {
        "business": "ASEM London Solutions",
        "name": "Cloud Platform Setup",
        "category": "Cloud",
        "description": "Scalable cloud infrastructure setup for modern applications.",
        "price": 799.00,
        "currency": "USD",
        "sku": "ASEM-CLOUD-001",
        "rating": 4.8,
        "stock": 75,
    },
    {
        "business": "ASEM Paris Digital",
        "name": "Digital Strategy Package",
        "category": "Consulting",
        "description": "Digital strategy and technology roadmap for growing companies.",
        "price": 599.00,
        "currency": "EUR",
        "sku": "ASEM-STRATEGY-001",
        "rating": 4.7,
        "stock": 40,
    },
]


def get_country(code):
    return Country.query.filter_by(code=code).first()


def get_city(name):
    return City.query.filter_by(name=name).first()


def seed_cities():
    created = 0

    for item in CITIES:
        country = get_country(item["country"])

        if not country:
            print(
                f"WARNING: country not found: {item['country']}"
            )
            continue

        city = City.query.filter_by(
            country_id=country.id,
            code=item["code"],
        ).first()

        if city:
            continue

        city = City(
            country_id=country.id,
            name=item["name"],
            code=item["code"],
            description=item["description"],
            latitude=item["latitude"],
            longitude=item["longitude"],
            population=item["population"],
            is_active=True,
        )

        db.session.add(city)
        created += 1

    db.session.commit()

    print(f"Cities created: {created}")


def seed_tourism():
    created = 0

    for item in TOURISM:
        city = get_city(item["city"])

        if not city:
            print(
                f"WARNING: city not found: {item['city']}"
            )
            continue

        exists = Tourism.query.filter_by(
            city_id=city.id,
            name=item["name"],
        ).first()

        if exists:
            continue

        place = Tourism(
            city_id=city.id,
            name=item["name"],
            category=item["category"],
            description=item["description"],
            address=item["address"],
            latitude=item["latitude"],
            longitude=item["longitude"],
            rating=item["rating"],
            verified=item["verified"],
            is_active=True,
        )

        db.session.add(place)
        created += 1

    db.session.commit()

    print(f"Tourism places created: {created}")


def seed_businesses():
    created = 0

    for item in BUSINESSES:
        city = get_city(item["city"])

        if not city:
            print(
                f"WARNING: city not found: {item['city']}"
            )
            continue

        exists = Business.query.filter_by(
            city_id=city.id,
            name=item["name"],
        ).first()

        if exists:
            continue

        business = Business(
            city_id=city.id,
            name=item["name"],
            category=item["category"],
            description=item["description"],
            address=item["address"],
            website=item["website"],
            rating=item["rating"],
            verified=item["verified"],
            is_active=True,
        )

        db.session.add(business)
        created += 1

    db.session.commit()

    print(f"Businesses created: {created}")


def seed_products():
    created = 0

    for item in PRODUCTS:
        business = Business.query.filter_by(
            name=item["business"]
        ).first()

        if not business:
            print(
                f"WARNING: business not found: {item['business']}"
            )
            continue

        exists = Product.query.filter_by(
            sku=item["sku"]
        ).first()

        if exists:
            continue

        product = Product(
            business_id=business.id,
            name=item["name"],
            category=item["category"],
            description=item["description"],
            price=item["price"],
            currency=item["currency"],
            sku=item["sku"],
            rating=item["rating"],
            stock=item["stock"],
            is_available=True,
            is_active=True,
        )

        db.session.add(product)
        created += 1

    db.session.commit()

    print(f"Products created: {created}")


def seed_global_platform():
    print("=" * 60)
    print("ASEM GLOBAL PLATFORM SEED")
    print("=" * 60)

    seed_cities()
    seed_tourism()
    seed_businesses()
    seed_products()

    print("=" * 60)
    print("GLOBAL PLATFORM SEED COMPLETED")
    print("=" * 60)
