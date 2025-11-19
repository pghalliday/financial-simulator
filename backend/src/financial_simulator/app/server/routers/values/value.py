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
    ChildrenModelField,
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
    fields={
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

value_scheduled_provider_get_mapper = GetMapper(
    table_model=ScheduledProvider,
    get_model=ValueScheduledProviderGet,
    fields={
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

value_model_fields = {
    "type": OrdinaryModelField(),
    "name": OrdinaryModelField(),
    "description": OrdinaryModelField(),
    "always_providers": ChildrenModelField(value_always_provider_get_mapper),
    "scheduled_providers": ChildrenModelField(value_scheduled_provider_get_mapper),
}
