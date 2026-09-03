import json
import os
from datetime import datetime


class ASEMDataPipeline:
    def __init__(self):
        self.database_path = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__),
                "../../database/world"
            )
        )

    def load_source(self, source_file):
        with open(source_file, "r", encoding="utf-8") as file:
            return json.load(file)

    def validate_record(self, record):
        required_fields = ["id", "names"]

        for field in required_fields:
            if field not in record:
                return False

        return True

    def import_data(self, database_file, records):
        database_path = os.path.join(
            self.database_path,
            database_file
        )

        with open(database_path, "r", encoding="utf-8") as file:
            database = json.load(file)

        imported = 0

        for record in records:

            if self.validate_record(record):

                exists = any(
                    item["id"] == record["id"]
                    for item in database["data"]
                )

                if not exists:
                    database["data"].append(record)
                    imported += 1

        with open(database_path, "w", encoding="utf-8") as file:
            json.dump(
                database,
                file,
                ensure_ascii=False,
                indent=2
            )

        return imported


def run_pipeline():

    pipeline = ASEMDataPipeline()

    print(
        "ASEM Global Data Pipeline Started",
        datetime.now()
    )

    # هنا سيتم ربط مصادر البيانات الحقيقية
    # Countries API
    # Cities Dataset
    # Business Sources
    # Tourism Sources

    print("Pipeline Ready")


if __name__ == "__main__":
    run_pipeline()
