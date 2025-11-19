from typing import Literal
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import AlwaysProvider, Value
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    FieldRelation,
    ParentModelField,
    GetMapper,
    OrdinaryGetField,
)
from .provider import ProviderGet, ProviderPost, provider_model_fields

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
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

always_provider_model_mapper = ModelMapper[
    AlwaysProvider,
    AlwaysProviderGet,
    AlwaysProviderPost,
](
    table_model=AlwaysProvider,
    get_model=AlwaysProviderGet,
    post_model=AlwaysProviderPost,
    fields={
        **provider_model_fields,
        "value_id": OptionalRelatedModelField(
            FieldRelation(field="value", model=Value)
        ),
        "value": ParentModelField(always_provider_value_get_mapper),
    },
)
