from decimal import Decimal
from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import PeriodicRate, RateType
from financial_simulator.app.server.routers.rates.rate import RatePost, RateGet, add_rate_model_fields
from financial_simulator.app.server.util.collection import Collection
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from financial_simulator.app.server.util.query_params import DefaultQueryParams


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


class PeriodicRateQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return PeriodicRate.name


router = APIRouter(
    prefix="/periodic-rates",
    tags=["periodic-rates"],
)


Collection(
    query_params_class=PeriodicRateQueryParams,
    model_mapper=periodic_rate_model_mapper,
).add_endpoints(
    router=router,
)
