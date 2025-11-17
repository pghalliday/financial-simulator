from decimal import Decimal
from typing import Literal

from financial_simulator.app.database.schema import PeriodicRate
from financial_simulator.app.server.routers.rates.rate import RatePost, RateGet, rate_model_fields
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)

PeriodicRateType = Literal["periodic_rate"]


class PeriodicRatePost(RatePost):
    type: PeriodicRateType
    annual_rate: Decimal | None = None
    period_count: int | None = None


class PeriodicRateGet(RateGet):
    type: PeriodicRateType
    annual_rate: Decimal | None
    period_count: int | None


periodic_rate_model_mapper = ModelMapper[
    PeriodicRate,
    PeriodicRateGet,
    PeriodicRatePost,
](
    table_model=PeriodicRate,
    get_model=PeriodicRateGet,
    post_model=PeriodicRatePost,
    fields={
        **rate_model_fields,
        "annual_rate": OrdinaryModelField(),
        "period_count": OrdinaryModelField(),
    },
)
