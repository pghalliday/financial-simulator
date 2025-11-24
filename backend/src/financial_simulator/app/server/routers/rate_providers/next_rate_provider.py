from typing import Literal, Sequence

from financial_simulator.app.database.schema import (
    RateProviderType,
    NextRateProvider,
    NextRateProviderProvider,
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


class NextRateProviderPost(RateProviderPost):
    type: Literal[RateProviderType.NEXT]
    rate_providers: Sequence[AssociationReference]


class NextRateProviderGet(RateProviderGet):
    type: Literal[RateProviderType.NEXT]
    rate_providers: Sequence[RateProviderDependentGet]


next_provider_model_mapper = ModelMapper(
    table_model=NextRateProvider,
    get_model=NextRateProviderGet,
    post_model=NextRateProviderPost,
)
(
    add_rate_provider_model_fields(next_provider_model_mapper)
    .field("rate_providers", AssociationModelField(
        association_field="rate_provider",
        association_model=NextRateProviderProvider,
        get_mapper=rate_provider_dependent_get_mapper,
    ))
)
