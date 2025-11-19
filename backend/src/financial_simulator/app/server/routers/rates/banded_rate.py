from decimal import Decimal
from typing import Literal, Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import BandedRate, BandedRateBand, Rate
from .rate import RatePost, RateGet, add_rate_model_fields
from ...util.model_mapper import (
    ModelMapper,
    ChildrenModelField,
    OrdinaryModelField,
    OptionalRelatedModelField,
)

BandedRateType = Literal["banded_rate"]


class BandedRateBandPost(BaseModel):
    size: Decimal | None = None
    rate_id: UUID | None = None


class BandedRatePost(RatePost):
    type: BandedRateType
    bands: Sequence[BandedRateBandPost]


class BandedRateBandGet(BaseModel):
    id: UUID
    size: Decimal | None
    rate_id: UUID | None


class BandedRateGet(RateGet):
    type: BandedRateType
    bands: Sequence[BandedRateBandGet]


banded_rate_band_model_mapper = ModelMapper(
    table_model=BandedRateBand,
    get_model=BandedRateBandGet,
    post_model=BandedRateBandPost,
)
(
    banded_rate_band_model_mapper
    .field("size", OrdinaryModelField())
    .field("rate_id", OptionalRelatedModelField(field="rate", model=Rate))
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
        banded_rate_band_model_mapper.post_model,
    ))
)
