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
    AssociationModelField, AssociationModelFieldParams,
)
from .provider import ProviderGet, ProviderPost, provider_model_fields

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
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

next_provider_model_mapper = ModelMapper[
    NextProvider,
    NextProviderGet,
    NextProviderPost,
](
    table_model=NextProvider,
    get_model=NextProviderGet,
    post_model=NextProviderPost,
    fields={
        **provider_model_fields,
        "providers": AssociationModelField(
            association_field="provider",
            params=AssociationModelFieldParams(
                association_model=NextProviderProvider,
                get_mapper=next_provider_provider_get_mapper,
            ),
        ),
    },
)
