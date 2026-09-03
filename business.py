ASEM Global Platform

Business Model
"""

from app.extensions import db


class Business(db.Model):
    """
    Represents a business registered on the platform.
    """

    __tablename__ = "businesses"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    city_id = db.Column(
        db.Integer,
        db.ForeignKey("cities.id"),
        nullable=False,
        index=True
    )


    name = db.Column(
        db.String(150),
        nullable=False
    )


    category = db.Column(
        db.String(100),
        nullable=False
    )


    description = db.Column(
        db.Text,
        nullable=True
    )


    address = db.Column(
        db.String(255),
        nullable=True
    )


    phone = db.Column(
        db.String(50),
        nullable=True
    )


    email = db.Column(
        db.String(120),
        nullable=True
    )


    website = db.Column(
        db.String(255),
        nullable=True
    )


    logo = db.Column(
        db.String(255),
        nullable=True
    )


    cover_image = db.Column(
        db.String(255),
        nullable=True
    )


    rating = db.Column(
        db.Float,
        default=0
    )


    verified = db.Column(
        db.Boolean,
        default=False,
        nullable=False
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


    # العلاقة مع المدينة
    city = db.relationship(
        "City",
        back_populates="businesses"
    )


    def __repr__(self):
        return f"<Business {self.name}>"


    def to_dict(self):
        return {
            "id": self.id,
            "city_id": self.city_id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "address": self.address,
            "phone": self.phone,
            "email": self.email,
            "website": self.website,
            "logo": self.logo,
            "cover_image": self.cover_image,
            "rating": self.rating,
            "verified": self.verified,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
from app.extensions import db


class Business(db.Model):
    __tablename__ = "businesses"

    id = db.Column(db.Integer, primary_key=True)

    city_id = db.Column(
        db.Integer,
        db.ForeignKey("cities.id"),
        nullable=False,
        index=True
    )

    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    address = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    email = db.Column(db.String(120))
    website = db.Column(db.String(255))

    logo = db.Column(db.String(255))
    cover_image = db.Column(db.String(255))

    rating = db.Column(
        db.Float,
        default=0
    )

    verified = db.Column(
        db.Boolean,
        default=False,
        nullable=False
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

    # City
    city = db.relationship(
        "City",
        back_populates="businesses"
    )

    # Products
    products = db.relationship(
        "Product",
        back_populates="business",
        cascade="all, delete-orphan",
        lazy=True
    )

    def __repr__(self):
        return f"<Business {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "city_id": self.city_id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "address": self.address,
            "phone": self.phone,
            "email": self.email,
            "website": self.website,
            "logo": self.logo,
            "cover_image": self.cover_image,
            "rating": self.rating,
            "verified": self.verified,
            "is_active": self.is_active
        }
