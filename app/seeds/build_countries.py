"""
ASEM Global Platform

Countries Dataset Builder

Builds the final countries.json file
from a global ISO dataset source.
"""

import json
import os


BASE_DIR = os.path.dirname(__file__)

SOURCE_FILE = os.path.join(
    BASE_DIR,
    "data",
    "countries_source.json"
)

OUTPUT_FILE = os.path.join(
    BASE_DIR,
    "data",
    "countries.json"
)


def build_countries():

    if not os.path.exists(SOURCE_FILE):
        raise FileNotFoundError(
            "Missing countries_source.json"
        )


    with open(
        SOURCE_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        countries = json.load(file)


    output = {
        "source": "ISO 3166-1 Global Dataset",
        "version": "1.0",
        "countries": countries
    }


    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            output,
            file,
            ensure_ascii=False,
            indent=2
        )


    print(
        "Countries file built successfully:",
        len(countries)
    )


if __name__ == "__main__":
    build_countries()
