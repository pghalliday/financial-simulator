from decimal import Decimal
from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import ContinuousRate, RateType
from financial_simulator.app.server.routers.rates.rate import (
    RatePost,
    RateGet,
    add_rate_model_fields,
)
from financial_simulator.app.server.util.collection import Collection
from financial_simulator.app.server.util.model_mapper import ModelMapper, OrdinaryModelField
from financial_simulator.app.server.util.query_params import DefaultQueryParams


class ContinuousRatePost(RatePost):
    type: Literal[RateType.CONTINUOUS]
    annual_rate: Decimal | None = None


class ContinuousRateGet(RateGet):
    type: Literal[RateType.CONTINUOUS]
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


class ContinuousRateQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return ContinuousRate.name


router = APIRouter(
    prefix="/continuous-rates",
    tags=["continuous-rates"],
)


Collection(
    query_params_class=ContinuousRateQueryParams,
    model_mapper=continuous_rate_model_mapper,
).add_endpoints(
    router=router,
)
