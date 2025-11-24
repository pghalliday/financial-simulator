from typing import Sequence
from uuid import UUID

from financial_simulator.app.database.schema.value.value_type import ValueType
from financial_simulator.app.server.util.typed_collection import TypedBaseModel
from financial_simulator.app.server.routers.providers.provider_dependent import ProviderDependentGet, \
    provider_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    OrdinaryModelField,
    ChildrenModelField, ModelMapper,
)


class ValuePost(TypedBaseModel[ValueType]):
    name: str
    description: str | None = None


class ValueGet(TypedBaseModel[ValueType]):
    id: UUID
    name: str
    description: str | None
    always_providers: Sequence[ProviderDependentGet]
    scheduled_providers: Sequence[ProviderDependentGet]


def add_value_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("always_providers", ChildrenModelField(provider_dependent_get_mapper))
        .field("scheduled_providers", ChildrenModelField(provider_dependent_get_mapper))
    )
