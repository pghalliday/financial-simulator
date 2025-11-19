from typing import Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import MergeProvider, NextProvider
from financial_simulator.app.server.routers.common import typed_collection
from financial_simulator.app.server.util.model_mapper import (
    OrdinaryModelField,
    AssociationModelField,
    OrdinaryGetField,
    GetMapper, ModelMapper,
)


class ProviderPost(typed_collection.TypedBaseModel):
    name: str
    description: str | None = None


class ProviderMergeProviderGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class ProviderNextProviderGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class ProviderGet(typed_collection.TypedBaseModel):
    id: UUID
    name: str
    description: str | None
    merge_providers: Sequence[ProviderMergeProviderGet]
    next_providers: Sequence[ProviderNextProviderGet]

provider_merge_provider_get_mapper = GetMapper(
    table_model=MergeProvider,
    get_model=ProviderMergeProviderGet,
)
(
    provider_merge_provider_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

provider_next_provider_get_mapper = GetMapper(
    table_model=NextProvider,
    get_model=ProviderNextProviderGet,
)
(
    provider_next_provider_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

def add_provider_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("merge_providers", AssociationModelField(
            association_field="merge_provider",
            get_mapper=provider_merge_provider_get_mapper,
        ))
        .field("next_providers", AssociationModelField(
            association_field="next_provider",
            get_mapper=provider_next_provider_get_mapper,
        ))
    )
