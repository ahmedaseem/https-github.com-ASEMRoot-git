from fastapi import FastAPI
from sqlalchemy import text

from app.database.connection import engine

app = FastAPI(
    title="ASEM Global API",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "project": "ASEM Global Platform",
        "status": "online"
    }


@app.get("/health")
def health():

    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "database": "connected",
        "status": "healthy"
    }
