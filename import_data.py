import json
import os


DATABASE_PATH = "../database/world"


def load_data(file_name):
    path = os.path.join(DATABASE_PATH, file_name)

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def save_data(file_name, content):
    path = os.path.join(DATABASE_PATH, file_name)

    with open(path, "w", encoding="utf-8") as file:
        json.dump(
            content,
            file,
            ensure_ascii=False,
            indent=2
        )


def add_record(file_name, record):
    database = load_data(file_name)

    database["data"].append(record)

    save_data(file_name, database)


# اختبار المضخة
new_country = {
    "id": "COUNTRY_ID",
    "names": [],
    "continent": "",
    "languages": [],
    "currency": "",
    "cities": []
}

add_record("countries.json", new_country)

print("ASEM Data Pump: Record Added")
