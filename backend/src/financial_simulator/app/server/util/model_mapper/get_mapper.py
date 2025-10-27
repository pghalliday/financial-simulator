from abc import ABC, abstractmethod
from typing import TypeVar, Generic

from pydantic import BaseModel

from financial_simulator.app.database.schema import BaseWithId


TABLE = TypeVar("TABLE", bound=BaseWithId)
GET = TypeVar("GET", bound=BaseModel)

class GetMapper(BaseModel, ABC, Generic[TABLE, GET]):
    class Config:
        frozen = True
    table_model: type[TABLE]
    get_model: type[GET]

    @abstractmethod
    def map_get(self, item: TABLE, depth: int = 0, max_parents: int = 0) -> GET:
        raise NotImplementedError()
