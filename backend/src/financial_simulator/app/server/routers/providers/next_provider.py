from typing import Literal, Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    Provider,
    NextProvider,
    NextProviderProvider,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    GetMapper,
    OrdinaryGetField,
    AssociationReference,
    AssociationModelField,
)
from .provider import ProviderGet, ProviderPost, add_provider_model_fields

NextProviderType = Literal["next_provider"]


class NextProviderPost(ProviderPost):
    type: NextProviderType
    providers: Sequence[AssociationReference]


class NextProviderProviderGet(BaseModel):
    id: UUID
    type: str
    name: str
    description: str | None

class NextProviderGet(ProviderGet):
    type: NextProviderType
    providers: Sequence[NextProviderProviderGet]


next_provider_provider_get_mapper = GetMapper(
    table_model=Provider,
    get_model=NextProviderProviderGet,
)
(
    next_provider_provider_get_mapper
    .field("type", OrdinaryGetField())
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

next_provider_model_mapper = ModelMapper(
    table_model=NextProvider,
    get_model=NextProviderGet,
    post_model=NextProviderPost,
)
(
    add_provider_model_fields(next_provider_model_mapper)
    .field("providers", AssociationModelField(
        association_field="provider",
        association_model=NextProviderProvider,
        get_mapper=next_provider_provider_get_mapper,
    ))
)
