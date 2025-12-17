from uuid import UUID

from pydantic import BaseModel


class DependentPost(BaseModel):
    id: UUID


class DependentGet(DependentPost):
    name: str
    description: str | None


class NamedDependentPost(BaseModel):
    name: str
    value: DependentPost | None = None


class NamedDependentGet(BaseModel):
    name: str
    value: DependentGet | None

