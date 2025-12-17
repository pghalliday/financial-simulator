from typing import Literal, Sequence, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    DecimalProviderType,
    MergeDecimalProvider,
    MergeDecimalProviderProvider,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationModelField,
)
from .decimal_provider import DecimalProviderGet, DecimalProviderPost, add_decimal_provider_model_fields
from .decimal_provider_dependent import (
    DecimalProviderDependentGet,
    decimal_provider_dependent_get_mapper,
)
from ...util.collection import Collection
from ...util.dependent_types import DependentPost
from ...util.query_params import DefaultQueryParams


class MergeDecimalProviderPost(DecimalProviderPost):
    type: Literal[DecimalProviderType.MERGE]
    decimal_providers: Sequence[DependentPost]


class MergeDecimalProviderGet(DecimalProviderGet):
    type: Literal[DecimalProviderType.MERGE]
    decimal_providers: Sequence[DecimalProviderDependentGet]


merge_provider_model_mapper = ModelMapper(
    table_model=MergeDecimalProvider,
    get_model=MergeDecimalProviderGet,
    post_model=MergeDecimalProviderPost,
)
(
    add_decimal_provider_model_fields(merge_provider_model_mapper)
    .field("decimal_providers", AssociationModelField(
        association_field="decimal_provider",
        association_model=MergeDecimalProviderProvider,
        get_mapper=decimal_provider_dependent_get_mapper,
    ))
)


class MergeDecimalProviderQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return MergeDecimalProvider.name


router = APIRouter(
    prefix="/merge-decimal-providers",
    tags=["merge-decimal-providers"],
)


Collection(
    query_params_class=MergeDecimalProviderQueryParams,
    model_mapper=merge_provider_model_mapper,
).add_endpoints(
    router=router,
)
