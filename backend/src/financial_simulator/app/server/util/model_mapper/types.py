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
RELATED_TABLE = TypeVar("RELATED_TABLE", bound=BaseWithId)
RELATED_GET = TypeVar('RELATED_GET', bound=BaseModel)
RELATED_POST = TypeVar('RELATED_POST', bound=BaseModel)
RELATED_PATCH = TypeVar('RELATED_PATCH', bound=BaseModel)

class FieldRelation(BaseModel, Generic[TABLE]):
    class Config:
        frozen = True

    field: str
    model: type[TABLE]

class GetMapperInterface(ABC, Generic[TABLE, GET]):
    table_model: type[TABLE]
    get_model: type[GET]

    @abstractmethod
    def map(self, item: TABLE, depth: int = 0, max_parents: int = 0) -> GET:
        raise NotImplementedError

class PostMapperInterface(ABC, Generic[TABLE, POST]):
    table_model: type[TABLE]
    post_model: type[POST]

    @abstractmethod
    def map(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        raise NotImplementedError

class PatchMapperInterface(ABC, Generic[TABLE, PATCH]):
    table_model: type[TABLE]
    patch_model: type[PATCH]

    @abstractmethod
    def map(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
        raise NotImplementedError

class ModelMapperInterface(ABC, Generic[TABLE, GET, POST, PATCH]):
    table_model: type[TABLE]
    get_model: type[GET]
    post_model: type[POST]
    patch_model: type[PATCH]
    has_invalid_relation_error: bool
    get_mapper: GetMapperInterface[TABLE, GET]
    post_mapper: PostMapperInterface[TABLE, POST]
    patch_mapper: PatchMapperInterface[TABLE, PATCH]

    @abstractmethod
    def map_get(self, item: TABLE, depth: int = 0, max_parents: int = 0) -> GET:
        raise NotImplementedError

    @abstractmethod
    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        raise NotImplementedError

    @abstractmethod
    def map_patch(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
        raise NotImplementedError

