from typing import Literal, Sequence

from financial_simulator.app.database.schema import (
    MergeProvider,
    MergeProviderProvider,
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


class MergeProviderPost(ProviderPost):
    type: Literal[ProviderType.MERGE]
    providers: Sequence[AssociationReference]


class MergeProviderGet(ProviderGet):
    type: Literal[ProviderType.MERGE]
    providers: Sequence[ProviderDependentGet]


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
        get_mapper=provider_dependent_get_mapper,
    ))
)
