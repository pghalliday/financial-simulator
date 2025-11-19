import logging
from typing import Union

from fastapi import APIRouter

from financial_simulator.app.database.schema import (
    Provider,
)

from financial_simulator.app.server.routers.common.typed_collection import TypedCollection
from .always_provider import (
    always_provider_model_mapper,
    AlwaysProviderGet,
    AlwaysProviderPost,
)
from .merge_provider import (
    MergeProviderGet,
    MergeProviderPost,
    merge_provider_model_mapper,
)
from .next_provider import NextProviderGet, NextProviderPost, next_provider_model_mapper
from .scheduled_provider import (
    ScheduledProviderGet,
    ScheduledProviderPost,
    scheduled_provider_model_mapper,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/providers",
    tags=["providers"],
)

TypedCollection(
    table_model=Provider,
    order_by=Provider.name,
    get_model=Union[
        AlwaysProviderGet, ScheduledProviderGet, MergeProviderGet, NextProviderGet
    ],
    post_model=Union[
        AlwaysProviderPost, ScheduledProviderPost, MergeProviderPost, NextProviderPost
    ],
    model_mappers={
        "always_provider": always_provider_model_mapper,
        "schedule_provider": scheduled_provider_model_mapper,
        "merge_provider": merge_provider_model_mapper,
        "next_provider": next_provider_model_mapper,
    },
).add_endpoints(
    router=router,
)
