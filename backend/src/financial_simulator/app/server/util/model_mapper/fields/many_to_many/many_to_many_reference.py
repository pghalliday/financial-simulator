from uuid import UUID

from pydantic import BaseModel


class ManyToManyReference(BaseModel):
    id: UUID
