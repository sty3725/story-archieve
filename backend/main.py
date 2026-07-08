from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.routers import archive
from backend.routers import auth
from backend.database import Base, engine
from backend import models

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")
app.mount("/media", StaticFiles(directory=FRONTEND_DIR / "media"), name="media")
app.mount("/pages", StaticFiles(directory=FRONTEND_DIR / "pages"), name="pages")

app.include_router(archive.router)


@app.get("/")
def root():
    return {"message": "writer platform backend"}


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "FastAPI backend is running"
    }