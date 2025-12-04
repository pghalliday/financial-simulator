from typing import Literal, Sequence, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    DecimalProviderType,
    NextDecimalProvider,
    NextDecimalProviderProvider,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationReference,
    AssociationModelField,
)
from .decimal_provider import DecimalProviderGet, DecimalProviderPost, add_decimal_provider_model_fields
from .decimal_provider_dependent import (
    DecimalProviderDependentGet,
    decimal_provider_dependent_get_mapper,
)
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class NextDecimalProviderPost(DecimalProviderPost):
    type: Literal[DecimalProviderType.NEXT]
    decimal_providers: Sequence[AssociationReference]


class NextDecimalProviderGet(DecimalProviderGet):
    type: Literal[DecimalProviderType.NEXT]
    decimal_providers: Sequence[DecimalProviderDependentGet]


next_provider_model_mapper = ModelMapper(
    table_model=NextDecimalProvider,
    get_model=NextDecimalProviderGet,
    post_model=NextDecimalProviderPost,
)
(
    add_decimal_provider_model_fields(next_provider_model_mapper)
    .field("decimal_providers", AssociationModelField(
        association_field="decimal_provider",
        association_model=NextDecimalProviderProvider,
        get_mapper=decimal_provider_dependent_get_mapper,
    ))
)


class NextDecimalProviderQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return NextDecimalProvider.name


router = APIRouter(
    prefix="/next-decimal-providers",
    tags=["next-decimal-providers"],
)


Collection(
    query_params_class=NextDecimalProviderQueryParams,
    model_mapper=next_provider_model_mapper,
).add_endpoints(
    router=router,
)
