ASEM Global Platform

City Model
"""

from app.extensions import db


class City(db.Model):
    """
    Represents a city belonging to a country.
    """

    __tablename__ = "cities"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    country_id = db.Column(
        db.Integer,
        db.ForeignKey("countries.id"),
        nullable=False,
        index=True
    )


    name = db.Column(
        db.String(100),
        nullable=False
    )


    code = db.Column(
        db.String(20),
        nullable=True
    )


    description = db.Column(
        db.Text,
        nullable=True
    )


    image = db.Column(
        db.String(255),
        nullable=True
    )


    latitude = db.Column(
        db.Float,
        nullable=True
    )


    longitude = db.Column(
        db.Float,
        nullable=True
    )


    population = db.Column(
        db.Integer,
        nullable=True
    )


    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
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


    # العلاقة مع الدولة
    country = db.relationship(
        "Country",
        back_populates="cities"
    )


    # العلاقة مع الأعمال
    businesses = db.relationship(
        "Business",
        back_populates="city",
        cascade="all, delete-orphan"
    )


    def __repr__(self):
        return f"<City {self.name}>"


    def to_dict(self):
        return {
            "id": self.id,
            "country_id": self.country_id,
            "name": self.name,
            "code": self.code,
            "description": self.description,
            "image": self.image,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "population": self.population,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
from app.extensions import db


class City(db.Model):
    __tablename__ = "cities"

    id = db.Column(db.Integer, primary_key=True)

    country_id = db.Column(
        db.Integer,
        db.ForeignKey("countries.id"),
        nullable=False,
        index=True
    )

    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20))
    description = db.Column(db.Text)
    image = db.Column(db.String(255))

    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    population = db.Column(db.Integer)

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
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

    # Country
    country = db.relationship(
        "Country",
        back_populates="cities"
    )

    # Businesses
    businesses = db.relationship(
        "Business",
        back_populates="city",
        cascade="all, delete-orphan"
    )

    # Tourism
    tourism_places = db.relationship(
        "Tourism",
        back_populates="city",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<City {self.name}>"
