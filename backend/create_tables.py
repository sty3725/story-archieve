from database import Base, engine
from models.archive import Work, Folder, Document

Base.metadata.create_all(bind=engine)

print("Archive tables created.")