from typing import Literal
from uuid import UUID

from pydantic import BaseModel

class NotFoundError(BaseModel):
    type: Literal["not-found"] = "not-found"
    id: UUID

class ChangeTypeError(BaseModel):
    type: Literal["change-type"] = "change-type"
    current_type: str
    new_type: str

class DatabaseIntegrityError(BaseModel):
    type: Literal["database-integrity"] = "database-integrity"
    message: str

class HTTPNotFoundError(BaseModel):
    detail: NotFoundError

class HTTPDatabaseIntegrityError(BaseModel):
    detail: DatabaseIntegrityError

class HTTPChangeTypeError(BaseModel):
    detail: ChangeTypeError
