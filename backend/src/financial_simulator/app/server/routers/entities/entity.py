from typing import Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import Scenario
from financial_simulator.app.server.routers.common import typed_collection
from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    OrdinaryGetField,
    OrdinaryModelField,
    ManyToManyModelField,
    ManyToManyReference, ModelMapper,
)


class EntityPost(typed_collection.TypedBaseModel):
    name: str
    description: str | None = None
    scenarios: Sequence[ManyToManyReference]


class EntityScenarioGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class EntityGet(typed_collection.TypedBaseModel):
    id: UUID
    name: str
    description: str | None
    scenarios: Sequence[EntityScenarioGet]


entity_scenario_get_mapper = GetMapper(
    table_model=Scenario,
    get_model=EntityScenarioGet,
)
(
    entity_scenario_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

def add_entity_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("scenarios", ManyToManyModelField(
            include_post=True,
            get_mapper=entity_scenario_get_mapper,
        ))
    )
