from typing import Literal, Sequence

from financial_simulator.app.database.schema import (
    RateProviderType,
    MergeRateProvider,
    MergeRateProviderProvider,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationReference,
    AssociationModelField,
)
from .rate_provider import RateProviderGet, RateProviderPost, add_rate_provider_model_fields
from .rate_provider_dependent import (
    RateProviderDependentGet,
    rate_provider_dependent_get_mapper,
)


class MergeRateProviderPost(RateProviderPost):
    type: Literal[RateProviderType.MERGE]
    rate_providers: Sequence[AssociationReference]


class MergeRateProviderGet(RateProviderGet):
    type: Literal[RateProviderType.MERGE]
    rate_providers: Sequence[RateProviderDependentGet]


merge_provider_model_mapper = ModelMapper(
    table_model=MergeRateProvider,
    get_model=MergeRateProviderGet,
    post_model=MergeRateProviderPost,
)
(
    add_rate_provider_model_fields(merge_provider_model_mapper)
    .field("rate_providers", AssociationModelField(
        association_field="rate_provider",
        association_model=MergeRateProviderProvider,
        get_mapper=rate_provider_dependent_get_mapper,
    ))
)
