from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Optional
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import BaseWithId


TABLE = TypeVar("TABLE", bound=BaseWithId)
GET = TypeVar("GET", bound=BaseModel)
POST = TypeVar("POST", bound=BaseModel)
PATCH = TypeVar("PATCH", bound=BaseModel)

class ModelMapper(BaseModel, ABC, Generic[TABLE, GET, POST, PATCH]):
    class Config:
        frozen = True
    table_model: type[TABLE]
    get_model: type[GET]
    post_model: type[POST]
    patch_model: type[PATCH]

    @abstractmethod
    def has_invalid_relation_error(self) -> bool:
        raise NotImplementedError()

    @abstractmethod
    def map_get(self, item: TABLE) -> GET:
        raise NotImplementedError()

    @abstractmethod
    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        raise NotImplementedError()

    @abstractmethod
    def map_patch(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
        raise NotImplementedError()
