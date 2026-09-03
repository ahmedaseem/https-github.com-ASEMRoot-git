import json
import os


BASE_DIR = os.path.dirname(__file__)

CONTINENTS_DIR = os.path.join(
    BASE_DIR,
    "data",
    "continents"
)

OUTPUT_FILE = os.path.join(
    BASE_DIR,
    "data",
    "countries_source.json"
)


continents = [
    "africa.json",
    "asia.json",
    "europe.json",
    "north_america.json",
    "south_america.json",
    "oceania.json",
    "antarctica.json"
]


def build():

    countries = []


    for file_name in continents:

        path = os.path.join(
            CONTINENTS_DIR,
            file_name
        )

        if os.path.exists(path):

            with open(
                path,
                "r",
                encoding="utf-8"
            ) as file:

                data = json.load(file)

                countries.extend(data)


    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            countries,
            file,
            ensure_ascii=False,
            indent=2
        )


    print(
        "Global countries:",
        len(countries)
    )


if __name__ == "__main__":
    build()

