from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Optional
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import BaseWithId


TABLE = TypeVar("TABLE", bound=BaseWithId)
POST = TypeVar("POST", bound=BaseModel)

class PostMapper(BaseModel, ABC, Generic[TABLE, POST]):
    class Config:
        frozen = True
    table_model: type[TABLE]
    post_model: type[POST]

    @abstractmethod
    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        raise NotImplementedError()
