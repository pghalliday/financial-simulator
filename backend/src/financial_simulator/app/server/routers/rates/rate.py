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
)


class RatePost(typed_collection.TypedBaseModel):
    name: str
    description: str | None = None


class RateBandedRateBandGet(BaseModel):
    id: UUID
    banded_rate_id: UUID
    size: Decimal | None


class RateValueGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class RateGet(typed_collection.TypedBaseModel):
    id: UUID
    name: str
    description: str | None
    banded_rate_bands: Sequence[RateBandedRateBandGet]
    rate_values: Sequence[RateValueGet]


rate_banded_rate_band_get_mapper = GetMapper(
    table_model=BandedRateBand,
    get_model=RateBandedRateBandGet,
    fields={
        "banded_rate_id": OrdinaryGetField(),
        "size": OrdinaryGetField(),
    },
)

rate_value_get_mapper = GetMapper(
    table_model=RateValue,
    get_model=RateValueGet,
    fields={
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

rate_model_fields = {
    "type": OrdinaryModelField(),
    "name": OrdinaryModelField(),
    "description": OrdinaryModelField(),
    "banded_rate_bands": ChildrenModelField(rate_banded_rate_band_get_mapper),
    "rate_values": ChildrenModelField(rate_value_get_mapper),
}
