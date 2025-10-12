from uuid import UUID

from pydantic import BaseModel

class NotFoundError(BaseModel):
    id: UUID

class HTTPNotFoundError(BaseModel):
    detail: NotFoundError

class HTTPIntegrityError(BaseModel):
    detail: str
