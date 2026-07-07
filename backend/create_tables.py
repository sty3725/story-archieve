from backend.database import Base, engine
from backend.models.archive import Work, Folder, Document

Base.metadata.create_all(bind=engine)

print("Archive tables created.")