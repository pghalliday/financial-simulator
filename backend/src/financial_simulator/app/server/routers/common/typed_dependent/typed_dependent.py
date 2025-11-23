from typing import Generic
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.server.routers.common.typed_collection import TYPE
from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    TABLE,
    OrdinaryGetField,
)

class TypedDependentGet(BaseModel, Generic[TYPE]):
    id: UUID
    type: TYPE
    name: str
    description: str | None


def create_typed_dependent_get_mapper(
        table_model: type[TABLE],
        get_model: type[TypedDependentGet[TYPE]]
) -> GetMapper[TABLE, TypedDependentGet[TYPE]]:
    return (
        GetMapper(
            table_model=table_model,
            get_model=get_model,
        )
        .field("type", OrdinaryGetField())
        .field("name", OrdinaryGetField())
        .field("description", OrdinaryGetField())
    )
