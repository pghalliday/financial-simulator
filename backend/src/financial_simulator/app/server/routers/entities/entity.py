from typing import Sequence
from uuid import UUID

from financial_simulator.app.database.schema import EntityType
from financial_simulator.app.server.util.dependent_types import (
    DependentGet,
    DependentPost,
)
from financial_simulator.app.server.util.typed_collection import TypedBaseModel
from financial_simulator.app.server.routers.scenarios.scenario_dependent import scenario_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    OrdinaryModelField,
    ManyToManyModelField,
    ModelMapper,
)


class EntityPost(TypedBaseModel[EntityType]):
    name: str
    description: str | None = None
    scenarios: Sequence[DependentPost]


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
