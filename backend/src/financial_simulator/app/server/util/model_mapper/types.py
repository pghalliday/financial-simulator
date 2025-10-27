from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Optional
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import BaseWithId

TABLE = TypeVar('TABLE', bound=BaseWithId)
GET = TypeVar('GET', bound=BaseModel)
POST = TypeVar('POST', bound=BaseModel)
PATCH = TypeVar('PATCH', bound=BaseModel)


class FieldRelation(BaseModel, Generic[TABLE]):
    class Config:
        frozen = True

    field: str
    model: type[TABLE]

class GetMapperInterface(ABC, Generic[TABLE, GET]):
    @abstractmethod
    def map(self, item: TABLE, depth: int = 0, max_parents: int = 0) -> GET:
        raise NotImplementedError

class PostMapperInterface(ABC, Generic[TABLE, POST]):
    @abstractmethod
    def map(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        raise NotImplementedError

class PatchMapperInterface(ABC, Generic[TABLE, PATCH]):
    @abstractmethod
    def map(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
        raise NotImplementedError
