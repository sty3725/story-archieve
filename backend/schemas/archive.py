from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    title: str
    content: str
    sort_order: int

    class Config:
        from_attributes = True


class FolderResponse(BaseModel):
    id: int
    title: str
    sort_order: int
    documents: list[DocumentResponse] = []

    class Config:
        from_attributes = True


class WorkResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    folders: list[FolderResponse] = []

    class Config:
        from_attributes = True