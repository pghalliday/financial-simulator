import logging
from typing import Union

from fastapi import APIRouter

from financial_simulator.app.database.schema import (
    Rate,
)

from financial_simulator.app.server.routers.common.typed_collection import TypedCollection
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

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/rates",
    tags=["rates"],
)

RateGet = Union[PeriodicRateGet, ContinuousRateGet, BandedRateGet]
RatePost = Union[PeriodicRatePost, ContinuousRatePost, BandedRatePost]

TypedCollection(
    table_model=Rate,
    order_by=Rate.name,
    get_model=RateGet,
    post_model=RatePost,
    model_mappers={
        "periodic_rate": periodic_rate_model_mapper,
        "continuous_rate": continuous_rate_model_mapper,
        "banded_rate": banded_rate_model_mapper,
    },
).add_endpoints(
    router=router,
)
