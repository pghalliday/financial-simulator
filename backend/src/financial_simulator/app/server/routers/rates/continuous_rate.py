from decimal import Decimal
from typing import Literal

from financial_simulator.app.database.schema import ContinuousRate
from financial_simulator.app.server.routers.rates.rate import (
    RatePost,
    RateGet,
    add_rate_model_fields,
)
from financial_simulator.app.server.util.model_mapper import ModelMapper, OrdinaryModelField

ContinuousRateType = Literal["continuous_rate"]


class ContinuousRatePost(RatePost):
    type: ContinuousRateType
    annual_rate: Decimal | None = None


class ContinuousRateGet(RateGet):
    type: ContinuousRateType
    annual_rate: Decimal | None


continuous_rate_model_mapper = ModelMapper(
    table_model=ContinuousRate,
    get_model=ContinuousRateGet,
    post_model=ContinuousRatePost,
)
(
    add_rate_model_fields(continuous_rate_model_mapper)
    .field("annual_rate", OrdinaryModelField())
)
