from typing import Literal, Sequence

from financial_simulator.app.database.schema import (
    NextProvider,
    NextProviderProvider,
)
from financial_simulator.app.database.schema.provider.provider_type import ProviderType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationReference,
    AssociationModelField,
)
from .provider import ProviderGet, ProviderPost, add_provider_model_fields
from financial_simulator.app.server.routers.providers.provider_dependent import (
    ProviderDependentGet,
    provider_dependent_get_mapper,
)


class NextProviderPost(ProviderPost):
    type: Literal[ProviderType.NEXT]
    providers: Sequence[AssociationReference]


class NextProviderGet(ProviderGet):
    type: Literal[ProviderType.NEXT]
    providers: Sequence[ProviderDependentGet]


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
        get_mapper=provider_dependent_get_mapper,
    ))
)
