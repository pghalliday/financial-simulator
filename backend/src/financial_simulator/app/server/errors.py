from uuid import UUID

from pydantic import BaseModel

class NotFoundError(BaseModel):
    id: UUID

class ChangeTypeError(BaseModel):
    current_type: str
    new_type: str

class HTTPNotFoundError(BaseModel):
    detail: NotFoundError

class HTTPIntegrityError(BaseModel):
    detail: str

class HTTPChangeTypeError(BaseModel):
    detail: ChangeTypeError
