"""
ASEM Global Platform
Global Products Seeder

Imports products from products.json and links each product
to its existing Business by business_name.
"""

import json
import os

from app.extensions import db
from app.models import Business, Product


BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "data", "products.json")


def seed_products():
    """
    Seed products from the global products catalog.

    Each product must contain:
        - business_name
        - name
        - category

    Products are linked to an existing Business by name.
    Existing products are skipped safely using SKU first,
    then business_id + name as a fallback.
    """

    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(
            f"Products data file not found: {DATA_FILE}"
        )

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    records = data.get("products", [])

    if not isinstance(records, list):
        raise ValueError(
            "Invalid products.json: 'products' must be a list."
        )

    created = 0
    skipped = 0

    # Cache businesses once instead of querying the database
    # repeatedly for every product.
    businesses = {
        business.name.strip(): business
        for business in Business.query.all()
        if business.name
    }

    for item in records:

        business_name = (
            item.get("business_name") or ""
        ).strip()

        product_name = (
            item.get("name") or ""
        ).strip()

        category = (
            item.get("category") or ""
        ).strip()

        sku = (
            item.get("sku") or ""
        ).strip() or None

        # -----------------------------------------------------
        # Validate required product fields
        # -----------------------------------------------------

        if not business_name:
            print(
                f"Product skipped - missing business_name: "
                f"{product_name or 'Unnamed product'}"
            )
            skipped += 1
            continue

        if not product_name:
            print(
                "Product skipped - missing product name"
            )
            skipped += 1
            continue

        if not category:
            print(
                f"Product skipped - missing category: "
                f"{product_name}"
            )
            skipped += 1
            continue

        # -----------------------------------------------------
        # Find Business
        # -----------------------------------------------------

        business = businesses.get(business_name)

        if not business:
            print(
                f"Product skipped - business not found: "
                f"{business_name}"
            )
            skipped += 1
            continue

        # -----------------------------------------------------
        # Prevent duplicates
        # -----------------------------------------------------

        exists = None

        if sku:
            exists = Product.query.filter_by(
                sku=sku
            ).first()

        if not exists:
            exists = Product.query.filter_by(
                business_id=business.id,
                name=product_name
            ).first()

        if exists:
            skipped += 1
            continue

        # -----------------------------------------------------
        # Create Product
        # -----------------------------------------------------

        product = Product(
            business_id=business.id,
            name=product_name,
            category=category,
            description=item.get("description"),
            price=item.get("price"),
            currency=item.get(
                "currency",
                "USD"
            ),
            image=item.get("image"),
            gallery=item.get(
                "gallery",
                []
            ),
            stock=item.get(
                "stock",
                0
            ),
            sku=sku,
            rating=item.get(
                "rating",
                0
            ),
            is_available=item.get(
                "is_available",
                True
            ),
            is_active=item.get(
                "is_active",
                True
            ),
        )

        db.session.add(product)
        created += 1

    db.session.commit()

    print(
        f"Products imported: {created}"
    )

    print(
        f"Products skipped: {skipped}"
    )


if __name__ == "__main__":
    seed_products()
