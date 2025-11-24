from decimal import Decimal
from typing import Literal

from financial_simulator.app.database.schema import PeriodicRate, RateType
from financial_simulator.app.server.routers.rates.rate import RatePost, RateGet, add_rate_model_fields
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)

class PeriodicRatePost(RatePost):
    type: Literal[RateType.PERIODIC]
    annual_rate: Decimal | None = None
    period_count: int | None = None


class PeriodicRateGet(RateGet):
    type: Literal[RateType.PERIODIC]
    annual_rate: Decimal | None
    period_count: int | None


periodic_rate_model_mapper = ModelMapper(
    table_model=PeriodicRate,
    get_model=PeriodicRateGet,
    post_model=PeriodicRatePost,
)
(
    add_rate_model_fields(periodic_rate_model_mapper)
    .field("annual_rate", OrdinaryModelField())
    .field("period_count", OrdinaryModelField())
)
