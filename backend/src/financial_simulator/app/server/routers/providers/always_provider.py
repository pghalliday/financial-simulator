from typing import Literal
from uuid import UUID

from financial_simulator.app.database.schema import AlwaysProvider, Value
from financial_simulator.app.database.schema.provider.provider_type import ProviderType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    ParentModelField,
)
from .provider import ProviderGet, ProviderPost, add_provider_model_fields
from financial_simulator.app.server.routers.values.value_dependent import (
    ValueDependentGet,
    value_dependent_get_mapper,
)


class AlwaysProviderPost(ProviderPost):
    type: Literal[ProviderType.ALWAYS]
    value_id: UUID | None = None


class AlwaysProviderGet(ProviderGet):
    type: Literal[ProviderType.ALWAYS]
    value_id: UUID | None
    value: ValueDependentGet | None


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
    .field("value", ParentModelField(value_dependent_get_mapper))
)
