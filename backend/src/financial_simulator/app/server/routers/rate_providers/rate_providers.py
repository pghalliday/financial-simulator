import logging
from typing import Union

from fastapi import APIRouter
from sqlalchemy import ColumnElement
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    RateProvider,
    RateProviderType,
)

from financial_simulator.app.server.util.typed_collection import TypedCollection
from .merge_rate_provider import (
    MergeRateProviderGet,
    MergeRateProviderPost,
    merge_provider_model_mapper,
)
from .next_rate_provider import NextRateProviderGet, NextRateProviderPost, next_provider_model_mapper
from .scheduled_rate_provider import (
    ScheduledRateProviderGet,
    ScheduledRateProviderPost,
    scheduled_provider_model_mapper,
)
from ...util.query_params import DefaultQueryParams

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/rate-providers",
    tags=["rate-providers"],
)


class RateProviderQueryParams(DefaultQueryParams):
    type: RateProviderType | None = None

    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return RateProvider.name

    def query_where(self) -> Union[ColumnElement[bool], None]:
        if self.type is None:
            return None
        return RateProvider.type == self.type


TypedCollection(
    table_model=RateProvider,
    query_params_class=RateProviderQueryParams,
    get_model=Union[
        ScheduledRateProviderGet, MergeRateProviderGet, NextRateProviderGet
    ],
    post_model=Union[
        ScheduledRateProviderPost, MergeRateProviderPost, NextRateProviderPost
    ],
    model_mappers={
        RateProviderType.SCHEDULED: scheduled_provider_model_mapper,
        RateProviderType.MERGE: merge_provider_model_mapper,
        RateProviderType.NEXT: next_provider_model_mapper,
    },
).add_endpoints(
    router=router,
)
