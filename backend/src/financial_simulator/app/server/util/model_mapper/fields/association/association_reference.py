from uuid import UUID

from pydantic import BaseModel


class AssociationReference(BaseModel):
    id: UUID
