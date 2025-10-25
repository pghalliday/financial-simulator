import logging
from typing import Optional, Union, Literal
from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    IndividualEntity,
    CorporationEntity,
    Entity,
    Scenario,
)

from .common import typed_collection, relation
from ..util import SimpleModelMapper

logger = logging.getLogger(__name__)

IndividualEntityType = Literal["individual_entity"]
CorporationEntityType = Literal["corporation_entity"]

class EntityPost(typed_collection.TypedBaseModel):
    name: str
    description: str

class IndividualEntityPost(EntityPost):
    type: IndividualEntityType

class CorporationEntityPost(EntityPost):
    type: CorporationEntityType


class EntityPatch(typed_collection.TypedBaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class IndividualEntityPatch(EntityPatch):
    type: IndividualEntityType

class CorporationEntityPatch(EntityPatch):
    type: CorporationEntityType

class EntityGet(typed_collection.TypedBaseModel):
    id: UUID
    name: str
    description: str

class IndividualEntityGet(EntityGet):
    type: IndividualEntityType

class CorporationEntityGet(EntityGet):
    type: CorporationEntityType


individual_model_mapper = SimpleModelMapper(
    table_model=IndividualEntity,
    get_model=IndividualEntityGet,
    post_model=IndividualEntityPost,
    patch_model=IndividualEntityPatch,
    fields=[
        "type",
        "name",
        "description",
    ]
)

corporation_model_mapper = SimpleModelMapper(
    table_model=CorporationEntity,
    get_model=CorporationEntityGet,
    post_model=CorporationEntityPost,
    patch_model=CorporationEntityPatch,
    fields=[
        "type",
        "name",
        "description",
    ]
)

router = APIRouter(
    prefix="/entities",
    tags=["entities"],
)

typed_collection.add_endpoints(
    router=router,
    base_table_model=Entity,
    order_by=Entity.name,
    get_model=Union[IndividualEntityGet, CorporationEntityGet],
    post_model=Union[IndividualEntityPost, CorporationEntityPost],
    patch_model=Union[IndividualEntityPatch, CorporationEntityPatch],
    model_mappers={
        "individual_entity": individual_model_mapper,
        "corporation_entity": corporation_model_mapper,
    },
)

class EntityScenarioGet(BaseModel):
    id: UUID
    name: str
    description: str

class EntityScenarioPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class EntityScenarioPost(BaseModel):
    id: UUID

def map_entity_scenario(scenario: Scenario) -> EntityScenarioGet:
    return EntityScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    )

related_model_mapper = SimpleModelMapper(
    table_model=Scenario,
    get_model=EntityScenarioGet,
    post_model=EntityScenarioPost,
    patch_model=EntityScenarioPatch,
    fields=[
        "name",
        "description",
    ]
)

relation.add_endpoints(
    router=router,
    relation_route="scenarios",
    relation_field="scenarios",
    table_model=Entity,
    model_mapper=related_model_mapper,
)
