import logging
from typing import Union

from fastapi import APIRouter

from financial_simulator.app.database.schema import (
    Value,
)
from financial_simulator.app.database.schema.value.value_type import ValueType

from financial_simulator.app.server.util.typed_collection import TypedCollection
from .rate_value import (
    rate_value_model_mapper,
    RateValueGet,
    RateValuePost,
)
from .decimal_value import (
    decimal_value_model_mapper,
    DecimalValueGet,
    DecimalValuePost,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/values",
    tags=["values"],
)

TypedCollection(
    table_model=Value,
    order_by=Value.name,
    get_model=Union[DecimalValueGet, RateValueGet],
    post_model=Union[DecimalValuePost, RateValuePost],
    model_mappers={
        ValueType.DECIMAL: decimal_value_model_mapper,
        ValueType.RATE: rate_value_model_mapper,
    },
).add_endpoints(
    router=router,
)
