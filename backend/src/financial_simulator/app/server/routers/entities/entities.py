import logging
from typing import Union

from fastapi import APIRouter
from sqlalchemy import ColumnElement
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    EntityType,
    Entity,
)

from financial_simulator.app.server.util.typed_collection import TypedCollection
from .corporation_entity import CorporationEntityPost, CorporationEntityGet, corporation_model_mapper
from .individual_entity import IndividualEntityPost, IndividualEntityGet, individual_model_mapper
from ...util.query_params import DefaultQueryParams

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/entities",
    tags=["entities"],
)


class EntityQueryParams(DefaultQueryParams):
    type: EntityType | None = None

    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return Entity.name

    def query_where(self) -> Union[ColumnElement[bool], None]:
        if self.type is None:
            return None
        return Entity.type == self.type


TypedCollection(
    table_model=Entity,
    query_params_class=EntityQueryParams,
    get_model=Union[IndividualEntityGet, CorporationEntityGet],
    post_model=Union[IndividualEntityPost, CorporationEntityPost],
    model_mappers={
        EntityType.INDIVIDUAL: individual_model_mapper,
        EntityType.CORPORATION: corporation_model_mapper,
    },
).add_endpoints(
    router=router,
)
