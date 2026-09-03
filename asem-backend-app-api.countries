from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.country import Country


router = APIRouter(
    prefix="/countries",
    tags=["Countries"]
)


@router.get("/")
def get_countries(
    db: Session = Depends(get_db)
):

    countries = db.query(
        Country
    ).all()

    return countries
