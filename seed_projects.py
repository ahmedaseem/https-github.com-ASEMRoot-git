import json

from app import create_app
from app.extensions import db
from app.models import Project


app = create_app()

with app.app_context():
    with open("projects.json", "r", encoding="utf-8") as f:
        projects = json.load(f)

    inserted = 0
    updated = 0

    for item in projects:
        name = item.get("name")

        if not name:
            continue

        project = Project.query.filter_by(name=name).first()

        if project is None:
            project = Project(name=name)
            db.session.add(project)
            inserted += 1
        else:
            updated += 1

        project.image = item.get("image")
        project.status = item.get("status")
        project.version = item.get("version")
        project.license = item.get("license")
        project.level = item.get("level")
        project.features = item.get("features", [])
        project.page = item.get("page")
        project.doc = item.get("doc")
        project.download = item.get("download")
        project.github = item.get("github")
        project.is_active = True

    db.session.commit()

    print(f"PROJECTS SEED OK")
    print(f"Inserted: {inserted}")
    print(f"Updated: {updated}")
    print(f"Total: {Project.query.count()}")
