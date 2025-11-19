from decimal import Decimal
from typing import Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    BandedRateBand,
    RateValue,
)
from financial_simulator.app.server.routers.common import typed_collection
from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    OrdinaryGetField,
    OrdinaryModelField,
    ChildrenModelField,
    ModelMapper,
)


class RatePost(typed_collection.TypedBaseModel):
    name: str
    description: str | None = None


class RateBandedRateBandGet(BaseModel):
    id: UUID
    banded_rate_id: UUID
    size: Decimal | None


class RateRateValueGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class RateGet(typed_collection.TypedBaseModel):
    id: UUID
    name: str
    description: str | None
    banded_rate_bands: Sequence[RateBandedRateBandGet]
    rate_values: Sequence[RateRateValueGet]


rate_banded_rate_band_get_mapper = GetMapper(
    table_model=BandedRateBand,
    get_model=RateBandedRateBandGet,
)
(
    rate_banded_rate_band_get_mapper
    .field("banded_rate_id", OrdinaryGetField())
    .field("size", OrdinaryGetField())
)

rate_value_get_mapper = GetMapper(
    table_model=RateValue,
    get_model=RateRateValueGet,
)
(
    rate_value_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

def add_rate_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("banded_rate_bands", ChildrenModelField(rate_banded_rate_band_get_mapper))
        .field("rate_values", ChildrenModelField(rate_value_get_mapper))
    )
