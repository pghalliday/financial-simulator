import logging
from typing import Union

from fastapi import APIRouter
from sqlalchemy import ColumnElement
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    RateType,
    Rate,
)

from financial_simulator.app.server.util.typed_collection import TypedCollection
from .banded_rate import (
    banded_rate_model_mapper,
    BandedRateGet,
    BandedRatePost,
)
from .continuous_rate import (
    continuous_rate_model_mapper,
    ContinuousRateGet,
    ContinuousRatePost,
)
from .periodic_rate import (
    periodic_rate_model_mapper,
    PeriodicRateGet,
    PeriodicRatePost,
)
from ...util.query_params import DefaultQueryParams

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/rates",
    tags=["rates"],
)


class RateQueryParams(DefaultQueryParams):
    type: RateType | None = None

    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return Rate.name

    def query_where(self) -> Union[ColumnElement[bool], None]:
        if self.type is None:
            return None
        return Rate.type == self.type


TypedCollection(
    table_model=Rate,
    query_params_class=RateQueryParams,
    get_model=Union[PeriodicRateGet, ContinuousRateGet, BandedRateGet],
    post_model=Union[PeriodicRatePost, ContinuousRatePost, BandedRatePost],
    model_mappers={
        RateType.PERIODIC: periodic_rate_model_mapper,
        RateType.CONTINUOUS: continuous_rate_model_mapper,
        RateType.BANDED: banded_rate_model_mapper,
    },
).add_endpoints(
    router=router,
)
