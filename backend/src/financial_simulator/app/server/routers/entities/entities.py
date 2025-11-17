import logging
from typing import Union

from fastapi import APIRouter

from financial_simulator.app.database.schema import (
    Entity,
)

from financial_simulator.app.server.routers.common.relation import Relation
from financial_simulator.app.server.routers.common.typed_collection import TypedCollection
from .corporation_entity import CorporationEntityPost, CorporationEntityGet, corporation_model_mapper
from .individual_entity import IndividualEntityPost, IndividualEntityGet, individual_model_mapper
from .entity import entity_scenario_get_mapper

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/entities",
    tags=["entities"],
)

EntityGet = Union[IndividualEntityGet, CorporationEntityGet]
EntityPost = Union[IndividualEntityPost, CorporationEntityPost]

TypedCollection(
    table_model=Entity,
    order_by=Entity.name,
    get_model=EntityGet,
    post_model=EntityPost,
    model_mappers={
        "individual_entity": individual_model_mapper,
        "corporation_entity": corporation_model_mapper,
    },
).add_endpoints(
    router=router,
)

Relation(
    relation_route="scenarios",
    relation_field="scenarios",
    table_model=Entity,
    get_mapper=entity_scenario_get_mapper,
).add_endpoints(
    router=router,
)
