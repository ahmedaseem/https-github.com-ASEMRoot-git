"""
ASEM Global Platform
ISO 3166-1 Country Dataset Builder

Generates the canonical country source used by the
ASEM database seed system.

The dataset is intentionally normalized around ISO 3166-1
alpha-2 country codes so that all future relations can use
stable country identifiers instead of database IDs.
"""

import json
from pathlib import Path

import pycountry


BASE_DIR = Path(__file__).resolve().parent
OUTPUT_FILE = BASE_DIR / "data" / "countries_source.json"


def country_flag(code: str) -> str:
    """
    Convert an ISO alpha-2 code to its Unicode flag emoji.
    """
    return "".join(
        chr(127397 + ord(char))
        for char in code.upper()
    )


def build():
    countries = []

    for country in pycountry.countries:

        code = country.alpha_2.upper()

        countries.append(
            {
                "code": code,
                "name": country.name,
                "phone_code": None,
                "currency": None,
                "language": None,
                "description": None,
                "flag": country_flag(code)
            }
        )

    countries.sort(
        key=lambda item: item["name"].casefold()
    )

    payload = {
        "source": "ISO 3166-1",
        "provider": "pycountry",
        "version": "1.0.0",
        "entity": "countries",
        "schema": "global-country-v1",
        "country_code_standard": "ISO 3166-1 alpha-2",
        "countries": countries
    }

    OUTPUT_FILE.write_text(
        json.dumps(
            payload,
            ensure_ascii=False,
            indent=2
        ) + "\n",
        encoding="utf-8"
    )

    print(
        f"Generated {len(countries)} countries."
    )

    print(
        f"Output: {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    build()
