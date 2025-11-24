import logging
from typing import Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    DecimalProviderType,
    DecimalProvider,
)

from financial_simulator.app.server.util.typed_collection import TypedCollection
from .merge_decimal_provider import (
    MergeDecimalProviderGet,
    MergeDecimalProviderPost,
    merge_provider_model_mapper,
)
from .next_decimal_provider import NextDecimalProviderGet, NextDecimalProviderPost, next_provider_model_mapper
from .scheduled_decimal_provider import (
    ScheduledDecimalProviderGet,
    ScheduledDecimalProviderPost,
    scheduled_provider_model_mapper,
)
from ...util.query_params import DefaultQueryParams

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/decimal-providers",
    tags=["decimal-providers"],
)

class DecimalProviderQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return DecimalProvider.name

TypedCollection(
    table_model=DecimalProvider,
    query_params_class=DecimalProviderQueryParams,
    get_model=Union[
        ScheduledDecimalProviderGet, MergeDecimalProviderGet, NextDecimalProviderGet
    ],
    post_model=Union[
        ScheduledDecimalProviderPost, MergeDecimalProviderPost, NextDecimalProviderPost
    ],
    model_mappers={
        DecimalProviderType.SCHEDULED: scheduled_provider_model_mapper,
        DecimalProviderType.MERGE: merge_provider_model_mapper,
        DecimalProviderType.NEXT: next_provider_model_mapper,
    },
).add_endpoints(
    router=router,
)
