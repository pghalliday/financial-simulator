import logging
from typing import Union

from fastapi import APIRouter

from financial_simulator.app.database.schema import (
    Rate,
)
from financial_simulator.app.database.schema.rate.rate_type import RateType

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

TypedCollection(
    table_model=Rate,
    order_by=Rate.name,
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
