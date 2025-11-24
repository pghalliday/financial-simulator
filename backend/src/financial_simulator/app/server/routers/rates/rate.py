from decimal import Decimal
from typing import Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    BandedRateBand,
)
from financial_simulator.app.database.schema.rate.rate_type import RateType
from financial_simulator.app.server.util.typed_collection import TypedBaseModel
from financial_simulator.app.server.routers.rates.rate_dependent import RateDependentGet, \
    rate_dependent_get_mapper
from financial_simulator.app.server.routers.values.value_dependent import ValueDependentGet, \
    value_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    OrdinaryGetField,
    OrdinaryModelField,
    ChildrenModelField,
    ModelMapper,
    ParentGetField,
)


class RatePost(TypedBaseModel[RateType]):
    name: str
    description: str | None = None


class RateBandedRateBandGet(BaseModel):
    id: UUID
    banded_rate_id: UUID
    banded_rate: RateDependentGet
    size: Decimal | None


class RateGet(TypedBaseModel[RateType]):
    id: UUID
    name: str
    description: str | None
    banded_rate_bands: Sequence[RateBandedRateBandGet]
    rate_values: Sequence[ValueDependentGet]


rate_banded_rate_band_get_mapper = GetMapper(
    table_model=BandedRateBand,
    get_model=RateBandedRateBandGet,
)
(
    rate_banded_rate_band_get_mapper
    .field("banded_rate_id", OrdinaryGetField())
    .field("banded_rate", ParentGetField(rate_dependent_get_mapper))
    .field("size", OrdinaryGetField())
)

def add_rate_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("banded_rate_bands", ChildrenModelField(rate_banded_rate_band_get_mapper))
        .field("rate_values", ChildrenModelField(value_dependent_get_mapper))
    )
