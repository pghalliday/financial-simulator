from typing import Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    BandedRateBands,
    BandedRateBand,
)
from financial_simulator.app.database.schema import RateType
from financial_simulator.app.server.routers.rate_providers.rate_provider_dependent import RateProviderDependentGet, \
    rate_provider_dependent_get_mapper
from financial_simulator.app.server.util.typed_collection import TypedBaseModel
from financial_simulator.app.server.routers.rates.rate_dependent import RateDependentGet, \
    rate_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    OrdinaryModelField,
    ChildrenModelField,
    ModelMapper,
    ParentGetField,
)


class RatePost(TypedBaseModel[RateType]):
    name: str
    description: str | None = None

class RateBandedRateBandsGet(BaseModel):
    banded_rate: RateDependentGet

class RateBandedRateBandGet(BaseModel):
    banded_rate_bands: RateBandedRateBandsGet

class RateGet(TypedBaseModel[RateType]):
    id: UUID
    name: str
    description: str | None
    banded_rate_bands_remainders: Sequence[RateBandedRateBandsGet]
    banded_rate_bands: Sequence[RateBandedRateBandGet]
    scheduled_rate_providers: Sequence[RateProviderDependentGet]


rate_banded_rate_bands_get_mapper = GetMapper(
    table_model=BandedRateBands,
    get_model=RateBandedRateBandsGet,
)
(
    rate_banded_rate_bands_get_mapper
    .field("banded_rate", ParentGetField(rate_dependent_get_mapper))
)

rate_banded_rate_band_get_mapper = GetMapper(
    table_model=BandedRateBand,
    get_model=RateBandedRateBandGet,
)
(
    rate_banded_rate_band_get_mapper
    .field("banded_rate_bands", ParentGetField(rate_banded_rate_bands_get_mapper))
)

def add_rate_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("banded_rate_bands_remainders", ChildrenModelField(rate_banded_rate_bands_get_mapper))
        .field("banded_rate_bands", ChildrenModelField(rate_banded_rate_band_get_mapper))
        .field("scheduled_rate_providers", ChildrenModelField(rate_provider_dependent_get_mapper))
    )
