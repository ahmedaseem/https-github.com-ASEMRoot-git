"""
ASEM Global Platform
Project Model
"""

from app.extensions import db


class Project(db.Model):

    __tablename__ = "projects"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    image = db.Column(
        db.String(255)
    )

    status = db.Column(
        db.String(100)
    )

    version = db.Column(
        db.String(50)
    )

    license = db.Column(
        db.String(50)
    )

    level = db.Column(
        db.String(50)
    )

    features = db.Column(
        db.JSON
    )

    page = db.Column(
        db.String(255)
    )

    doc = db.Column(
        db.String(255)
    )

    download = db.Column(
        db.String(255)
    )

    github = db.Column(
        db.String(255)
    )

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True,
        server_default=db.true()
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "image": self.image,
            "status": self.status,
            "version": self.version,
            "license": self.license,
            "level": self.level,
            "features": self.features or [],
            "page": self.page,
            "doc": self.doc,
            "download": self.download,
            "github": self.github,
            "is_active": self.is_active,
        }
