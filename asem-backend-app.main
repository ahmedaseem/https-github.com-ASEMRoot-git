from fastapi import FastAPI

from app.api.countries import router as countries_router


app = FastAPI(
    title="ASEM Global API",
    version="1.0"
)


app.include_router(
    countries_router
)


@app.get("/")
def home():

    return {
        "name": "ASEM",
        "status": "online"
    }
