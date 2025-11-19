from typing import Literal, Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    MergeProvider,
    Provider,
    MergeProviderProvider,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    GetMapper,
    OrdinaryGetField,
    AssociationReference,
    AssociationModelField,
)
from .provider import ProviderGet, ProviderPost, add_provider_model_fields

MergeProviderType = Literal["merge_provider"]


class MergeProviderPost(ProviderPost):
    type: MergeProviderType
    providers: Sequence[AssociationReference]


class MergeProviderProviderGet(BaseModel):
    id: UUID
    type: str
    name: str
    description: str | None

class MergeProviderGet(ProviderGet):
    type: MergeProviderType
    providers: Sequence[MergeProviderProviderGet]


merge_provider_provider_get_mapper = GetMapper(
    table_model=Provider,
    get_model=MergeProviderProviderGet,
)
(
    merge_provider_provider_get_mapper
    .field("type", OrdinaryGetField())
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

merge_provider_model_mapper = ModelMapper(
    table_model=MergeProvider,
    get_model=MergeProviderGet,
    post_model=MergeProviderPost,
)
(
    add_provider_model_fields(merge_provider_model_mapper)
    .field("providers", AssociationModelField(
        association_field="provider",
        association_model=MergeProviderProvider,
        get_mapper=merge_provider_provider_get_mapper,
    ))
)
