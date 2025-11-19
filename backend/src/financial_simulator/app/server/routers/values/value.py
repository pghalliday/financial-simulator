from typing import Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    ScheduledProvider,
    AlwaysProvider,
)
from financial_simulator.app.server.routers.common import typed_collection
from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    OrdinaryGetField,
    OrdinaryModelField,
    ChildrenModelField, ModelMapper,
)


class ValuePost(typed_collection.TypedBaseModel):
    name: str
    description: str | None = None


class ValueAlwaysProviderGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class ValueScheduledProviderGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class ValueGet(typed_collection.TypedBaseModel):
    id: UUID
    name: str
    description: str | None
    always_providers: Sequence[ValueAlwaysProviderGet]
    scheduled_providers: Sequence[ValueScheduledProviderGet]


value_always_provider_get_mapper = GetMapper(
    table_model=AlwaysProvider,
    get_model=ValueAlwaysProviderGet,
)
(
    value_always_provider_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

value_scheduled_provider_get_mapper = GetMapper(
    table_model=ScheduledProvider,
    get_model=ValueScheduledProviderGet,
)
(
    value_scheduled_provider_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

def add_value_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("always_providers", ChildrenModelField(value_always_provider_get_mapper))
        .field("scheduled_providers", ChildrenModelField(value_scheduled_provider_get_mapper))
    )
