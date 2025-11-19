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
    AssociationModelField, AssociationModelFieldParams,
)
from .provider import ProviderGet, ProviderPost, provider_model_fields

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
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

merge_provider_model_mapper = ModelMapper[
    MergeProvider,
    MergeProviderGet,
    MergeProviderPost,
](
    table_model=MergeProvider,
    get_model=MergeProviderGet,
    post_model=MergeProviderPost,
    fields={
        **provider_model_fields,
        "providers": AssociationModelField(
            association_field="provider",
            params=AssociationModelFieldParams(
                association_model=MergeProviderProvider,
                get_mapper=merge_provider_provider_get_mapper,
            ),
        ),
    },
)
