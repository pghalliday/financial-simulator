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

class RelationInvalidError(BaseModel):
    type: Literal["relation-invalid"] = "relation-invalid"
    relation_name: str
    id: UUID

class RelatedItemNotFoundError(BaseModel):
    type: Literal["related-item-not-found"] = "related-item-not-found"
    relation_name: str
    id: UUID

class DatabaseIntegrityError(BaseModel):
    type: Literal["database-integrity"] = "database-integrity"
    message: str

class HTTPNotFoundError(BaseModel):
    detail: NotFoundError

class HTTPDatabaseIntegrityError(BaseModel):
    detail: DatabaseIntegrityError

class HTTPChangeTypeError(BaseModel):
    detail: ChangeTypeError

class HTTPRelationInvalidError(BaseModel):
    detail: RelationInvalidError

class HTTPRelatedItemNotFoundError(BaseModel):
    detail: RelatedItemNotFoundError
