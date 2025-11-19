from typing import Literal
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import AlwaysProvider, Value
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    ParentModelField,
    GetMapper,
    OrdinaryGetField,
)
from .provider import ProviderGet, ProviderPost, add_provider_model_fields

AlwaysProviderType = Literal["always_provider"]


class AlwaysProviderPost(ProviderPost):
    type: AlwaysProviderType
    value_id: UUID | None = None


class AlwaysProviderValueGet(BaseModel):
    id: UUID
    type: str
    name: str
    description: str | None

class AlwaysProviderGet(ProviderGet):
    type: AlwaysProviderType
    value_id: UUID | None
    value: AlwaysProviderValueGet | None


always_provider_value_get_mapper = GetMapper(
    table_model=Value,
    get_model=AlwaysProviderValueGet,
)
(
    always_provider_value_get_mapper
    .field("type", OrdinaryGetField())
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

always_provider_model_mapper = ModelMapper(
    table_model=AlwaysProvider,
    get_model=AlwaysProviderGet,
    post_model=AlwaysProviderPost,
)
(
    add_provider_model_fields(always_provider_model_mapper)
    .field("value_id", OptionalRelatedModelField(
        field="value", model=Value
    ))
    .field("value", ParentModelField(always_provider_value_get_mapper))
)
