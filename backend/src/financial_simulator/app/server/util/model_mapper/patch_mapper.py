from abc import ABC, abstractmethod
from typing import TypeVar, Generic

from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import BaseWithId


TABLE = TypeVar("TABLE", bound=BaseWithId)
PATCH = TypeVar("PATCH", bound=BaseModel)

class PatchMapper(BaseModel, ABC, Generic[TABLE, PATCH]):
    class Config:
        frozen = True
    table_model: type[TABLE]
    patch_model: type[PATCH]

    @abstractmethod
    def map_patch(self, session: Session, item: TABLE, item_patch: PATCH) -> None:
        raise NotImplementedError()
