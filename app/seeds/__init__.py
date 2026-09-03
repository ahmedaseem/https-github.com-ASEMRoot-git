"""
ASEM Global Platform

Global Seed Manager
"""

from app.seeds.countries import seed_countries


def run_all_seeds():

    seed_countries()

    print(
        "Global seed process completed"
    )

