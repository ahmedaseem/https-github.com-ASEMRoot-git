from sqlalchemy import Column, String, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base


class Country(Base):

    __tablename__ = "countries"

    id = Column(
        UUID,
        primary_key=True
    )

    code = Column(
        String(10),
        unique=True,
        nullable=False
    )

    continent = Column(
        String(100)
    )

    currency_code = Column(
        String(10)
    )

    names = Column(
        JSON,
        nullable=False
    )

    verified = Column(
        Boolean,
        default=False
    )
