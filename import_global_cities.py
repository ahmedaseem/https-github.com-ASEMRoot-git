import csv
import io
import json
import os
import sqlite3
import urllib.request
import zipfile

BASE = "/root/my-site"
DB = os.path.join(BASE, "asem.db")
COUNTRIES_FILE = os.path.join(BASE, "countries.json")

# GeoNames: cities with population >= 5000
URL = "https://download.geonames.org/export/dump/cities5000.zip"

print("=== ASEM GLOBAL CITY IMPORT ===")

# --------------------------------------------------
# 1. Load countries.json
# --------------------------------------------------

with open(COUNTRIES_FILE, "r", encoding="utf-8") as f:
    country_data = json.load(f)

countries = country_data.get("countries", [])

print("Countries source:", len(countries))

# --------------------------------------------------
# 2. Connect SQLite
# --------------------------------------------------

conn = sqlite3.connect(DB)
conn.execute("PRAGMA foreign_keys = ON")

cur = conn.cursor()

# --------------------------------------------------
# 3. Import countries first
# --------------------------------------------------

country_map = {}

for item in countries:
    code = (item.get("code") or "").upper().strip()
    name = item.get("name")

    if not code or not name:
        continue

    cur.execute(
        """
        SELECT id
        FROM countries
        WHERE code = ?
        """,
        (code,)
    )

    row = cur.fetchone()

    if row:
        country_id = row[0]

        cur.execute(
            """
            UPDATE countries
            SET name = ?,
                phone_code = ?,
                currency = ?,
                language = ?,
                description = ?,
                flag = ?,
                is_active = 1
            WHERE id = ?
            """,
            (
                name,
                item.get("phone_code"),
                item.get("currency"),
                item.get("language"),
                item.get("description"),
                item.get("flag"),
                country_id,
            )
        )
    else:
        cur.execute(
            """
            INSERT INTO countries
            (
                name,
                code,
                phone_code,
                currency,
                language,
                description,
                flag,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            """,
            (
                name,
                code,
                item.get("phone_code"),
                item.get("currency"),
                item.get("language"),
                item.get("description"),
                item.get("flag"),
            )
        )

        country_id = cur.lastrowid

    country_map[code] = country_id

conn.commit()

print("Countries in database:", len(country_map))

# --------------------------------------------------
# 4. Download GeoNames
# --------------------------------------------------

zip_path = "/tmp/asem_cities5000.zip"

print("Downloading city dataset...")

urllib.request.urlretrieve(URL, zip_path)

print("Download complete.")

# --------------------------------------------------
# 5. Read GeoNames
# --------------------------------------------------

created = 0
updated = 0
skipped = 0
seen_countries = set()

with zipfile.ZipFile(zip_path, "r") as z:
    names = z.namelist()

    # cities5000.zip contains cities5000.txt
    data_file = next(
        name for name in names
        if name.endswith(".txt")
    )

    with z.open(data_file) as raw:
        text = io.TextIOWrapper(
            raw,
            encoding="utf-8"
        )

        reader = csv.reader(
            text,
            delimiter="\t"
        )

        for row in reader:

            if len(row) < 19:
                skipped += 1
                continue

            geoname_id = row[0]
            name = row[1]
            ascii_name = row[2]

            try:
                latitude = float(row[4])
                longitude = float(row[5])
                population = int(row[14] or 0)
            except ValueError:
                skipped += 1
                continue

            country_code = row[8].upper().strip()

            if country_code not in country_map:
                skipped += 1
                continue

            country_id = country_map[country_code]

            seen_countries.add(country_code)

            # Stable unique city code from GeoNames
            city_code = "GN" + geoname_id

            # --------------------------------------------------
            # Check existing city
            # --------------------------------------------------

            cur.execute(
                """
                SELECT id
                FROM cities
                WHERE code = ?
                """,
                (city_code,)
            )

            existing = cur.fetchone()

            description = (
                f"{name}, {country_code}"
            )

            if existing:

                cur.execute(
                    """
                    UPDATE cities
                    SET country_id = ?,
                        name = ?,
                        description = ?,
                        latitude = ?,
                        longitude = ?,
                        population = ?,
                        is_active = 1
                    WHERE code = ?
                    """,
                    (
                        country_id,
                        name,
                        description,
                        latitude,
                        longitude,
                        population,
                        city_code,
                    )
                )

                updated += 1

            else:

                cur.execute(
                    """
                    INSERT INTO cities
                    (
                        country_id,
                        name,
                        code,
                        description,
                        image,
                        latitude,
                        longitude,
                        population,
                        is_active
                    )
                    VALUES (?, ?, ?, ?, NULL, ?, ?, ?, 1)
                    """,
                    (
                        country_id,
                        name,
                        city_code,
                        description,
                        latitude,
                        longitude,
                        population,
                    )
                )

                created += 1

            # Commit periodically
            if (created + updated) % 1000 == 0:
                conn.commit()
                print(
                    f"Processed: {created + updated:,} cities",
                    end="\r"
                )

conn.commit()

# --------------------------------------------------
# 6. Cleanup
# --------------------------------------------------

try:
    os.remove(zip_path)
except OSError:
    pass

# --------------------------------------------------
# 7. Final report
# --------------------------------------------------

cur.execute("SELECT COUNT(*) FROM countries")
countries_count = cur.fetchone()[0]

cur.execute("SELECT COUNT(*) FROM cities")
cities_count = cur.fetchone()[0]

cur.execute(
    """
    SELECT COUNT(DISTINCT country_id)
    FROM cities
    """
)
countries_with_cities = cur.fetchone()[0]

print()
print()
print("======================================")
print(" ASEM GLOBAL IMPORT COMPLETE")
print("======================================")
print("Countries:", countries_count)
print("Cities:", cities_count)
print("Countries with cities:", countries_with_cities)
print("Created cities:", created)
print("Updated cities:", updated)
print("Skipped rows:", skipped)
print("======================================")

conn.close()
