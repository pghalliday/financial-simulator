from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    TABLE,
    OrdinaryGetField,
)


class DependentGet(BaseModel):
    id: UUID
    name: str
    description: str | None


def create_dependent_get_mapper(table_model: type[TABLE]) -> GetMapper[TABLE, DependentGet]:
    return (
        GetMapper(
            table_model=table_model,
            get_model=DependentGet,
        )
        .field("name", OrdinaryGetField())
        .field("description", OrdinaryGetField())
    )
