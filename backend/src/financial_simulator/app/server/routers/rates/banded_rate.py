from decimal import Decimal
from typing import Literal, Sequence, Union
from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import BandedRate, BandedRateBand, Rate, RateType
from .rate import RatePost, RateGet, add_rate_model_fields
from financial_simulator.app.server.routers.rates.rate_dependent import (
    RateDependentGet,
    rate_dependent_get_mapper,
)
from ...util.collection import Collection
from ...util.model_mapper import (
    ModelMapper,
    ChildrenModelField,
    OrdinaryModelField,
    OptionalRelatedModelField,
    ParentModelField,
)
from ...util.query_params import DefaultQueryParams


class BandedRateBandPost(BaseModel):
    size: Decimal | None = None
    rate_id: UUID | None = None


class BandedRatePost(RatePost):
    type: Literal[RateType.BANDED]
    bands: Sequence[BandedRateBandPost]


class BandedRateBandGet(BaseModel):
    id: UUID
    size: Decimal | None
    rate_id: UUID | None
    rate: RateDependentGet | None


class BandedRateGet(RateGet):
    type: Literal[RateType.BANDED]
    bands: Sequence[BandedRateBandGet]


banded_rate_band_model_mapper = ModelMapper(
    table_model=BandedRateBand,
    get_model=BandedRateBandGet,
    post_model=BandedRateBandPost,
)
(
    banded_rate_band_model_mapper.field("size", OrdinaryModelField())
    .field("rate_id", OptionalRelatedModelField(field="rate", model=Rate))
    .field("rate", ParentModelField(rate_dependent_get_mapper))
)

banded_rate_model_mapper = ModelMapper(
    table_model=BandedRate,
    get_model=BandedRateGet,
    post_model=BandedRatePost,
)
(
    add_rate_model_fields(banded_rate_model_mapper)
    .field("bands", ChildrenModelField(
        banded_rate_band_model_mapper.get_mapper,
        banded_rate_band_model_mapper.post_mapper,
    ))
)


class BandedRateQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return BandedRate.name


router = APIRouter(
    prefix="/banded-rates",
    tags=["banded-rates"],
)


Collection(
    query_params_class=BandedRateQueryParams,
    model_mapper=banded_rate_model_mapper,
).add_endpoints(
    router=router,
)
