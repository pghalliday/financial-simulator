from typing import Literal, Sequence, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    RateProviderType,
    MergeRateProvider,
    MergeRateProviderProvider,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationModelField,
)
from .rate_provider import RateProviderGet, RateProviderPost, add_rate_provider_model_fields
from .rate_provider_dependent import (
    RateProviderDependentGet,
    rate_provider_dependent_get_mapper,
)
from ...util.collection import Collection
from ...util.dependent_types import DependentPost
from ...util.query_params import DefaultQueryParams


class MergeRateProviderPost(RateProviderPost):
    type: Literal[RateProviderType.MERGE]
    rate_providers: Sequence[DependentPost]


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


class MergeRateProviderQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return MergeRateProvider.name


router = APIRouter(
    prefix="/merge-rate-providers",
    tags=["merge-rate-providers"],
)


Collection(
    query_params_class=MergeRateProviderQueryParams,
    model_mapper=merge_provider_model_mapper,
).add_endpoints(
    router=router,
)
