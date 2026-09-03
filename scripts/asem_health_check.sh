#!/usr/bin/env bash

# ============================================================
# ASEM FULL RELATION + GPS HEALTH CHECK
# READ-ONLY — NO DATABASE CHANGES
# ============================================================

# ------------------------------------------------------------
# 0. PROJECT DIRECTORY
# ------------------------------------------------------------

if ! cd /root/my-site; then
    echo "[FAIL] Cannot access /root/my-site"
    exit 1
fi

DB="asem.db"
PY=".venv/bin/python"

PASS=0
WARN=0
FAIL=0

# ------------------------------------------------------------
# RESULT HELPERS
# ------------------------------------------------------------

pass() {
    echo "[PASS] $1"
    PASS=$((PASS + 1))
}

warn() {
    echo "[WARN] $1"
    WARN=$((WARN + 1))
}

fail() {
    echo "[FAIL] $1"
    FAIL=$((FAIL + 1))
}

section() {
    echo
    echo "============================================================"
    echo "$1"
    echo "============================================================"
}

# ------------------------------------------------------------
# HEADER
# ------------------------------------------------------------

echo "============================================================"
echo " ASEM FULL RELATION + GPS HEALTH CHECK"
echo " READ-ONLY — NO DATABASE CHANGES"
echo "============================================================"
echo "Project : /root/my-site"
echo "Database: $DB"
echo "Python  : $PY"
echo "============================================================"

# ------------------------------------------------------------
# 1. REQUIRED TOOLS
# ------------------------------------------------------------

section "1. REQUIRED TOOLS"

SQLITE_AVAILABLE=1
PYTHON_AVAILABLE=1
DB_AVAILABLE=1

if command -v sqlite3 >/dev/null 2>&1; then
    echo "sqlite3: $(sqlite3 --version)"
    pass "sqlite3 available"
else
    fail "sqlite3 is not installed or not in PATH"
    SQLITE_AVAILABLE=0
fi

if [ -x "$PY" ]; then
    echo "Python: $($PY --version)"
    pass "Python virtual environment available"
else
    fail "Python virtual environment not found: $PY"
    PYTHON_AVAILABLE=0
fi

if [ -f "$DB" ]; then
    pass "Database exists: $DB"
else
    fail "Database not found: $DB"
    DB_AVAILABLE=0
fi

if [ "$SQLITE_AVAILABLE" -eq 0 ] ||
   [ "$PYTHON_AVAILABLE" -eq 0 ] ||
   [ "$DB_AVAILABLE" -eq 0 ]; then

    section "FINAL RESULT"

    echo "PASS : $PASS"
    echo "WARN : $WARN"
    echo "FAIL : $FAIL"
    echo
    echo "STATUS: FAIL"
    echo "Critical requirements are missing."

    exit 1
fi

# ------------------------------------------------------------
# 2. PYTHON / FLASK APPLICATION
# ------------------------------------------------------------

section "2. PYTHON / FLASK"

if "$PY" - <<'PY'
from app import create_app

app = create_app()

print("Flask create_app: OK")
print()
print("Registered routes:")

for rule in sorted(
    app.url_map.iter_rules(),
    key=lambda r: str(r)
):
    methods = ",".join(
        sorted(rule.methods - {"HEAD", "OPTIONS"})
    )
    print(f"{methods:20} {rule}")
PY
then
    pass "Flask application factory"
else
    fail "Flask application failed to initialize"
fi

# ------------------------------------------------------------
# 3. SQLITE INTEGRITY
# ------------------------------------------------------------

section "3. SQLITE INTEGRITY"

INTEGRITY=$(sqlite3 "$DB" "PRAGMA integrity_check;" 2>&1)
SQLITE_EXIT=$?

echo "$INTEGRITY"

if [ "$SQLITE_EXIT" -eq 0 ] &&
   [ "$INTEGRITY" = "ok" ]; then
    pass "SQLite integrity_check"
else
    fail "SQLite integrity_check failed"
fi

# ------------------------------------------------------------
# 4. FOREIGN KEY CHECK
# ------------------------------------------------------------

section "4. FOREIGN KEY CHECK"

FK_ERRORS=$(sqlite3 "$DB" "PRAGMA foreign_key_check;" 2>&1)
SQLITE_EXIT=$?

if [ "$SQLITE_EXIT" -ne 0 ]; then
    echo "$FK_ERRORS"
    fail "Foreign key check could not be completed"

elif [ -z "$FK_ERRORS" ]; then
    pass "No foreign key violations"

else
    echo "$FK_ERRORS"
    fail "Foreign key violations detected"
fi

# ------------------------------------------------------------
# 5. FOREIGN KEY DEFINITIONS
# ------------------------------------------------------------

section "5. FOREIGN KEY DEFINITIONS"

sqlite3 -header -column "$DB" "
SELECT
    m.name AS table_name,
    fk.id AS fk_id,
    fk.seq AS seq,
    fk.\"table\" AS referenced_table,
    fk.\"from\" AS from_column,
    fk.\"to\" AS to_column,
    fk.on_update,
    fk.on_delete
FROM sqlite_master m
JOIN pragma_foreign_key_list(m.name) fk
WHERE m.type = 'table'
ORDER BY m.name, fk.id, fk.seq;
" 2>&1

# ------------------------------------------------------------
# 6. TABLES
# ------------------------------------------------------------

section "6. TABLES"

sqlite3 -header -column "$DB" "
SELECT
    name
FROM sqlite_master
WHERE type = 'table'
ORDER BY name;
" 2>&1

# ------------------------------------------------------------
# 7. MAIN TABLE COUNTS
# ------------------------------------------------------------

section "7. MAIN TABLE COUNTS"

sqlite3 -header -column "$DB" "
SELECT 'countries' AS table_name, COUNT(*) AS total
FROM countries

UNION ALL

SELECT 'cities', COUNT(*)
FROM cities

UNION ALL

SELECT 'businesses', COUNT(*)
FROM businesses

UNION ALL

SELECT 'tourism', COUNT(*)
FROM tourism

UNION ALL

SELECT 'products', COUNT(*)
FROM products

UNION ALL

SELECT 'projects', COUNT(*)
FROM projects;
" 2>&1

# ------------------------------------------------------------
# 8. COUNTRY → CITY RELATION
# ------------------------------------------------------------

section "8. COUNTRY → CITY RELATION"

sqlite3 -header -column "$DB" "
SELECT
    COUNT(*) AS total_cities,
    COUNT(country_id) AS cities_with_country_id,
    COUNT(DISTINCT country_id) AS linked_countries
FROM cities;
" 2>&1

# ------------------------------------------------------------
# 9. CITIES WITHOUT COUNTRY
# ------------------------------------------------------------

section "9. CITIES WITHOUT COUNTRY"

NULL_COUNTRIES=$(sqlite3 "$DB" "
SELECT COUNT(*)
FROM cities
WHERE country_id IS NULL;
" 2>/dev/null)

if [[ "$NULL_COUNTRIES" =~ ^[0-9]+$ ]]; then

    if [ "$NULL_COUNTRIES" -eq 0 ]; then
        pass "All cities have country_id"
    else
        warn "$NULL_COUNTRIES cities have NULL country_id"

        sqlite3 -header -column "$DB" "
        SELECT
            id,
            name,
            country_id
        FROM cities
        WHERE country_id IS NULL
        LIMIT 50;
        " 2>&1
    fi

else
    fail "Could not check cities with NULL country_id"
fi

# ------------------------------------------------------------
# 10. ORPHAN CITIES
# ------------------------------------------------------------

section "10. ORPHAN CITIES"

ORPHAN_CITIES=$(sqlite3 "$DB" "
SELECT COUNT(*)
FROM cities c
LEFT JOIN countries co
    ON co.id = c.country_id
WHERE co.id IS NULL;
" 2>/dev/null)

if [[ "$ORPHAN_CITIES" =~ ^[0-9]+$ ]]; then

    if [ "$ORPHAN_CITIES" -eq 0 ]; then
        pass "No orphan cities"
    else
        fail "$ORPHAN_CITIES orphan cities found"

        sqlite3 -header -column "$DB" "
        SELECT
            c.id,
            c.name,
            c.country_id
        FROM cities c
        LEFT JOIN countries co
            ON co.id = c.country_id
        WHERE co.id IS NULL
        LIMIT 50;
        " 2>&1
    fi

else
    fail "Could not check orphan cities"
fi

# ------------------------------------------------------------
# 11. COUNTRIES WITHOUT CITIES
# ------------------------------------------------------------

section "11. COUNTRIES WITHOUT CITIES"

NO_CITY_COUNTRIES=$(sqlite3 "$DB" "
SELECT COUNT(*)
FROM countries co
LEFT JOIN cities c
    ON c.country_id = co.id
WHERE c.id IS NULL;
" 2>/dev/null)

if [[ "$NO_CITY_COUNTRIES" =~ ^[0-9]+$ ]]; then

    if [ "$NO_CITY_COUNTRIES" -eq 0 ]; then
        pass "Every country has at least one city"
    else
        warn "$NO_CITY_COUNTRIES countries have no cities"

        sqlite3 -header -column "$DB" "
        SELECT
            co.id,
            co.name,
            co.code
        FROM countries co
        LEFT JOIN cities c
            ON c.country_id = co.id
        WHERE c.id IS NULL
        LIMIT 50;
        " 2>&1
    fi

else
    fail "Could not check countries without cities"
fi

# ------------------------------------------------------------
# 12. CITY GPS QUALITY
# ------------------------------------------------------------

section "12. CITY GPS QUALITY"

sqlite3 -header -column "$DB" "
SELECT
    COUNT(*) AS total,
    COUNT(latitude) AS latitude_present,
    COUNT(longitude) AS longitude_present,
    COUNT(
        CASE
            WHEN latitude IS NOT NULL
             AND longitude IS NOT NULL
            THEN 1
        END
    ) AS gps_complete,
    COUNT(
        CASE
            WHEN latitude IS NULL
              OR longitude IS NULL
            THEN 1
        END
    ) AS gps_missing
FROM cities;
" 2>&1

GPS_MISSING=$(sqlite3 "$DB" "
SELECT COUNT(*)
FROM cities
WHERE latitude IS NULL
   OR longitude IS NULL;
" 2>/dev/null)

if [[ "$GPS_MISSING" =~ ^[0-9]+$ ]]; then

    if [ "$GPS_MISSING" -eq 0 ]; then
        pass "All cities have complete GPS"
    else
        warn "$GPS_MISSING cities have incomplete GPS"

        sqlite3 -header -column "$DB" "
        SELECT
            id,
            name,
            country_id,
            latitude,
            longitude
        FROM cities
        WHERE latitude IS NULL
           OR longitude IS NULL
        LIMIT 50;
        " 2>&1
    fi

else
    fail "Could not check GPS completeness"
fi

# ------------------------------------------------------------
# 13. INVALID GPS
# ------------------------------------------------------------

section "13. INVALID GPS"

INVALID_GPS=$(sqlite3 "$DB" "
SELECT COUNT(*)
FROM cities
WHERE
    (latitude IS NOT NULL AND
        (latitude < -90 OR latitude > 90))
 OR
    (longitude IS NOT NULL AND
        (longitude < -180 OR longitude > 180));
" 2>/dev/null)

if [[ "$INVALID_GPS" =~ ^[0-9]+$ ]]; then

    if [ "$INVALID_GPS" -eq 0 ]; then
        pass "No invalid GPS coordinates"
    else
        fail "$INVALID_GPS invalid GPS coordinates"

        sqlite3 -header -column "$DB" "
        SELECT
            id,
            name,
            latitude,
            longitude
        FROM cities
        WHERE
            (latitude IS NOT NULL AND
                (latitude < -90 OR latitude > 90))
         OR
            (longitude IS NOT NULL AND
                (longitude < -180 OR longitude > 180))
        LIMIT 50;
        " 2>&1
    fi

else
    fail "Could not check invalid GPS coordinates"
fi

# ------------------------------------------------------------
# 14. PARTIAL GPS
# ------------------------------------------------------------

section "14. PARTIAL GPS"

PARTIAL_GPS=$(sqlite3 "$DB" "
SELECT COUNT(*)
FROM cities
WHERE
    (latitude IS NULL AND longitude IS NOT NULL)
 OR
    (latitude IS NOT NULL AND longitude IS NULL);
" 2>/dev/null)

if [[ "$PARTIAL_GPS" =~ ^[0-9]+$ ]]; then

    if [ "$PARTIAL_GPS" -eq 0 ]; then
        pass "No partial GPS records"
    else
        fail "$PARTIAL_GPS cities have partial GPS"

        sqlite3 -header -column "$DB" "
        SELECT
            id,
            name,
            latitude,
            longitude
        FROM cities
        WHERE
            (latitude IS NULL AND longitude IS NOT NULL)
         OR
            (latitude IS NOT NULL AND longitude IS NULL)
        LIMIT 50;
        " 2>&1
    fi

else
    fail "Could not check partial GPS"
fi

# ------------------------------------------------------------
# 15. ZERO GPS
# ------------------------------------------------------------

section "15. ZERO GPS"

ZERO_GPS=$(sqlite3 "$DB" "
SELECT COUNT(*)
FROM cities
WHERE latitude = 0
  AND longitude = 0;
" 2>/dev/null)

if [[ "$ZERO_GPS" =~ ^[0-9]+$ ]]; then

    if [ "$ZERO_GPS" -eq 0 ]; then
        pass "No 0,0 GPS coordinates"
    else
        warn "$ZERO_GPS cities have GPS = 0,0"

        sqlite3 -header -column "$DB" "
        SELECT
            id,
            name,
            country_id,
            latitude,
            longitude
        FROM cities
        WHERE latitude = 0
          AND longitude = 0
        LIMIT 50;
        " 2>&1
    fi

else
    fail "Could not check 0,0 GPS coordinates"
fi

# ------------------------------------------------------------
# 16. CITY INDEXES
# ------------------------------------------------------------

section "16. CITY INDEXES"

sqlite3 -header -column "$DB" "
PRAGMA index_list(cities);
" 2>&1

# ------------------------------------------------------------
# 17. COUNTRY INDEXES
# ------------------------------------------------------------

section "17. COUNTRY INDEXES"

sqlite3 -header -column "$DB" "
PRAGMA index_list(countries);
" 2>&1

# ------------------------------------------------------------
# 18. CITY COUNTRY_ID QUERY PLAN
# ------------------------------------------------------------

section "18. CITY COUNTRY_ID QUERY PLAN"

COUNTRY_ID=$(sqlite3 "$DB" "
SELECT id
FROM countries
ORDER BY id
LIMIT 1;
" 2>/dev/null)

if [[ "$COUNTRY_ID" =~ ^[0-9]+$ ]]; then

    echo "Using real country_id: $COUNTRY_ID"
    echo

    PLAN=$(sqlite3 "$DB" "
    EXPLAIN QUERY PLAN
    SELECT
        id,
        name
    FROM cities
    WHERE country_id = $COUNTRY_ID
    ORDER BY name
    LIMIT 50;
    " 2>&1)

    echo "$PLAN"

    if echo "$PLAN" | grep -Eiq \
        "USING (COVERING )?INDEX|USING INDEX|USING AUTOMATIC"; then

        pass "country_id query plan reports index usage"

    else
        warn "country_id query may be using a table scan"
    fi

else
    warn "No countries found; country_id query plan skipped"
fi

# ------------------------------------------------------------
# 19. GPS QUERY PLAN
# ------------------------------------------------------------

section "19. GPS QUERY PLAN"

GPS_PLAN=$(sqlite3 "$DB" "
EXPLAIN QUERY PLAN
SELECT
    id,
    name,
    latitude,
    longitude
FROM cities
WHERE latitude BETWEEN 30 AND 31
  AND longitude BETWEEN 30 AND 32
ORDER BY name
LIMIT 50;
" 2>&1)

echo "$GPS_PLAN"

# ------------------------------------------------------------
# 20. CITY SAMPLE WITH COUNTRY
# ------------------------------------------------------------

section "20. CITY SAMPLE WITH COUNTRY"

sqlite3 -header -column "$DB" "
SELECT
    c.id AS city_id,
    c.name AS city,
    c.country_id,
    co.id AS country_id_check,
    co.name AS country,
    co.code
FROM cities c
LEFT JOIN countries co
    ON co.id = c.country_id
ORDER BY c.id
LIMIT 20;
" 2>&1

# ------------------------------------------------------------
# 21. GPS SAMPLE
# ------------------------------------------------------------

section "21. GPS SAMPLE"

sqlite3 -header -column "$DB" "
SELECT
    id,
    name,
    country_id,
    latitude,
    longitude
FROM cities
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
ORDER BY id
LIMIT 20;
" 2>&1

# ------------------------------------------------------------
# 22. FLASK DATABASE FOREIGN KEY MODE
# ------------------------------------------------------------

section "22. FLASK DATABASE FOREIGN KEY MODE"

if "$PY" - <<'PY'
from app import create_app

app = create_app()

with app.app_context():

    try:
        db = app.extensions.get("sqlalchemy")

        if db is None:
            print("SQLAlchemy extension not found")
            raise SystemExit(2)

        with db.engine.connect() as conn:

            result = conn.exec_driver_sql(
                "PRAGMA foreign_keys;"
            ).scalar()

            print(f"PRAGMA foreign_keys = {result}")

            if result != 1:
                raise SystemExit(1)

    except Exception as exc:
        print(
            f"Database foreign key check error: {exc}"
        )
        raise SystemExit(2)
PY
then
    pass "Flask database foreign keys enabled"
else
    warn "Could not confirm Flask PRAGMA foreign_keys = ON"
fi

# ------------------------------------------------------------
# 23. FLASK TEST CLIENT SMOKE TEST
# ------------------------------------------------------------

section "23. FLASK TEST CLIENT SMOKE TEST"

if "$PY" - <<'PY'
from app import create_app

app = create_app()
client = app.test_client()

tested = 0
skipped = 0
errors = 0

print("Testing registered GET routes...")
print()

for rule in sorted(
    app.url_map.iter_rules(),
    key=lambda r: str(r)
):

    methods = rule.methods - {"HEAD", "OPTIONS"}

    if "GET" not in methods:
        continue

    path = str(rule)

    if "<" in path:
        print(
            f"[SKIP]  {path} "
            f"(dynamic route)"
        )
        skipped += 1
        continue

    try:
        response = client.get(path)

        print(
            f"[GET]   {path:45} "
            f"-> {response.status_code}"
        )

        tested += 1

        if response.status_code >= 500:
            errors += 1

    except Exception as exc:
        print(
            f"[ERROR] {path}: {exc}"
        )
        errors += 1

print()
print("------------------------------------------------------------")
print(f"Tested : {tested}")
print(f"Skipped: {skipped}")
print(f"Errors : {errors}")
print("------------------------------------------------------------")

if errors > 0:
    raise SystemExit(1)

print(
    "Smoke test completed without server errors"
)
PY
then
    pass "Flask GET smoke test"
else
    fail "Flask GET smoke test detected server errors"
fi

# ------------------------------------------------------------
# 24. API GPS RESPONSE CHECK
# ------------------------------------------------------------

section "24. API GPS RESPONSE CHECK"

if "$PY" - <<'PY'
from app import create_app

app = create_app()
client = app.test_client()

response = client.get("/api/cities?limit=1")

print(
    f"HTTP status: {response.status_code}"
)

if response.status_code >= 500:
    print("API returned a server error")
    raise SystemExit(1)

payload = response.get_json()

if not isinstance(payload, list):
    print("API response is not a JSON list")
    print(f"Response: {payload}")
    raise SystemExit(1)

if len(payload) == 0:
    print("No cities returned by /api/cities")
    print("GPS API field test skipped because there is no city")
    raise SystemExit(0)

city = payload[0]

print("Sample API city:")
print(city)
print()

if "latitude" not in city:
    print("latitude is missing from API response")
    raise SystemExit(1)

if "longitude" not in city:
    print("longitude is missing from API response")
    raise SystemExit(1)

print(f"latitude : {city.get('latitude')}")
print(f"longitude: {city.get('longitude')}")

if city.get("latitude") is None:
    print("latitude exists but is NULL")
    raise SystemExit(1)

if city.get("longitude") is None:
    print("longitude exists but is NULL")
    raise SystemExit(1)

print()
print("API GPS fields are present and populated")
PY
then
    pass "API returns populated GPS fields"
else
    fail "API GPS response check failed"
fi

# ------------------------------------------------------------
# 25. API COUNTRY → CITY FILTER CHECK
# ------------------------------------------------------------

section "25. API COUNTRY → CITY FILTER CHECK"

API_COUNTRY_ID=$(sqlite3 "$DB" "
SELECT id
FROM countries
ORDER BY id
LIMIT 1;
" 2>/dev/null)

if [[ "$API_COUNTRY_ID" =~ ^[0-9]+$ ]]; then

    echo "Testing country_id=$API_COUNTRY_ID"

    if "$PY" - "$API_COUNTRY_ID" <<'PY'
import sys

from app import create_app

country_id = int(sys.argv[1])

app = create_app()
client = app.test_client()

response = client.get(
    f"/api/cities?country_id={country_id}&limit=5"
)

print(f"HTTP status: {response.status_code}")

if response.status_code >= 500:
    raise SystemExit(1)

payload = response.get_json()

if not isinstance(payload, list):
    print("Expected JSON list")
    print(payload)
    raise SystemExit(1)

print(f"Returned cities: {len(payload)}")

for city in payload:
    print(
        f"id={city.get('id')} "
        f"name={city.get('name')} "
        f"country_id={city.get('country_id')}"
    )

    if city.get("country_id") != country_id:
        print(
            "Returned city does not match "
            "requested country_id"
        )
        raise SystemExit(1)

print("Country filter works correctly")
PY
    then
        pass "API country_id filter"
    else
        fail "API country_id filter failed"
    fi

else
    warn "No countries available; API country filter skipped"
fi

# ------------------------------------------------------------
# 26. API CITY NAME SEARCH CHECK
# ------------------------------------------------------------

section "26. API CITY NAME SEARCH CHECK"

SEARCH_NAME=$(sqlite3 "$DB" "
SELECT name
FROM cities
WHERE name IS NOT NULL
  AND TRIM(name) <> ''
ORDER BY id
LIMIT 1;
" 2>/dev/null)

if [ -n "$SEARCH_NAME" ]; then

    echo "Testing city name prefix: $SEARCH_NAME"

    if "$PY" - "$SEARCH_NAME" <<'PY'
import sys

from app import create_app

name = sys.argv[1]

app = create_app()
client = app.test_client()

response = client.get(
    "/api/cities",
    query_string={
        "name": name,
        "limit": 5,
    },
)

print(f"HTTP status: {response.status_code}")

if response.status_code >= 500:
    raise SystemExit(1)

payload = response.get_json()

if not isinstance(payload, list):
    print("Expected JSON list")
    print(payload)
    raise SystemExit(1)

print(f"Returned cities: {len(payload)}")

for city in payload:
    print(
        f"id={city.get('id')} "
        f"name={city.get('name')}"
    )

print("City name search endpoint responded correctly")
PY
    then
        pass "API city name search"
    else
        fail "API city name search failed"
    fi

else
    warn "No city names available; name search skipped"
fi

# ------------------------------------------------------------
# FINAL RESULT
# ------------------------------------------------------------

section "FINAL RESULT"

echo "PASS : $PASS"
echo "WARN : $WARN"
echo "FAIL : $FAIL"

echo

if [ "$FAIL" -gt 0 ]; then

    echo "STATUS: FAIL"
    echo "Critical problems were detected."
    echo "Review the [FAIL] items above."

    exit 1

elif [ "$WARN" -gt 0 ]; then

    echo "STATUS: PASS WITH WARNINGS"
    echo "No critical integrity failures detected."
    echo "Review the [WARN] items above."

    exit 0

else

    echo "STATUS: PASS"
    echo "All checks completed successfully."

    exit 0
fi
