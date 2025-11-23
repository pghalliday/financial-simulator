from typing import Sequence
from uuid import UUID

from financial_simulator.app.database.schema.entity.entity_type import EntityType
from financial_simulator.app.server.routers.common.dependent import (
    DependentGet,
)
from financial_simulator.app.server.routers.common.typed_collection import TypedBaseModel
from financial_simulator.app.server.routers.scenarios.scenario_dependent import scenario_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    OrdinaryModelField,
    ManyToManyModelField,
    ManyToManyReference, ModelMapper,
)


class EntityPost(TypedBaseModel[EntityType]):
    name: str
    description: str | None = None
    scenarios: Sequence[ManyToManyReference]


class EntityGet(TypedBaseModel[EntityType]):
    id: UUID
    name: str
    description: str | None
    scenarios: Sequence[DependentGet]


def add_entity_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("scenarios", ManyToManyModelField(
            include_post=True,
            get_mapper=scenario_dependent_get_mapper,
        ))
    )
