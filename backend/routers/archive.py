from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models.archive import Work, Folder, Document
from schemas.archive import WorkResponse

router = APIRouter(
    prefix="/api/archive",
    tags=["archive"]
)


@router.get("/works", response_model=list[WorkResponse])
def get_archive_works(db: Session = Depends(get_db)):
    works = (
        db.query(Work)
        .options(
            joinedload(Work.folders).joinedload(Folder.documents)
        )
        .order_by(Work.id)
        .all()
    )

    return works