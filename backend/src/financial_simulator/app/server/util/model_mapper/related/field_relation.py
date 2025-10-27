from typing import TypeVar, Generic

from pydantic import BaseModel

from financial_simulator.app.database.schema import BaseWithId

RELATED_TABLE = TypeVar("RELATED_TABLE", bound=BaseWithId)


class FieldRelation(BaseModel, Generic[RELATED_TABLE]):
    field: str
    model: type[RELATED_TABLE]
