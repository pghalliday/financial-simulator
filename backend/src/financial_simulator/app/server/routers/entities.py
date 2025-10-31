import logging
from typing import Union, Literal, Sequence
from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    IndividualEntity,
    CorporationEntity,
    Entity,
    Scenario,
)

from .common import typed_collection
from .common.relation import Relation
from .common.typed_collection import TypedCollection
from ..util.model_mapper import (
    GetMapper,
    ModelMapper,
    ChildrenModelField,
    ChildReference,
)
from ..util.model_mapper import OrdinaryGetField, OrdinaryModelField
from ..util.model_mapper.fields.children.children_model_field import ChildrenModelFieldParams

logger = logging.getLogger(__name__)

IndividualEntityType = Literal["individual_entity"]
CorporationEntityType = Literal["corporation_entity"]

class EntityPost(typed_collection.TypedBaseModel):
    name: str
    description: str | None = None
    scenarios: Sequence[ChildReference]

class IndividualEntityPost(EntityPost):
    type: IndividualEntityType

class CorporationEntityPost(EntityPost):
    type: CorporationEntityType


class EntityPatch(typed_collection.TypedBaseModel):
    name: str | None = None
    description: str | None = None
    scenarios: Sequence[ChildReference] | None = None

class IndividualEntityPatch(EntityPatch):
    type: IndividualEntityType

class CorporationEntityPatch(EntityPatch):
    type: CorporationEntityType

class EntityScenarioGet(BaseModel):
    id: UUID
    name: str
    description: str | None

class EntityGet(typed_collection.TypedBaseModel):
    id: UUID
    name: str
    description: str | None
    scenarios: Sequence[EntityScenarioGet]

class IndividualEntityGet(EntityGet):
    type: IndividualEntityType

class CorporationEntityGet(EntityGet):
    type: CorporationEntityType


entity_scenario_get_mapper = GetMapper(
    table_model=Scenario,
    get_model=EntityScenarioGet,
    fields={
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

individual_model_mapper = ModelMapper[
    IndividualEntity,
    IndividualEntityGet,
    IndividualEntityPost,
    IndividualEntityPatch
](
    table_model=IndividualEntity,
    get_model=IndividualEntityGet,
    post_model=IndividualEntityPost,
    patch_model=IndividualEntityPatch,
    fields={
        "type": OrdinaryModelField(),
        "name": OrdinaryModelField(),
        "description": OrdinaryModelField(),
        "scenarios": ChildrenModelField(ChildrenModelFieldParams(
            include_post_and_patch=True,
            get_mapper=entity_scenario_get_mapper,
        )),
    },
)

corporation_model_mapper = ModelMapper[
    CorporationEntity,
    CorporationEntityGet,
    CorporationEntityPost,
    CorporationEntityPatch,
](
    table_model=CorporationEntity,
    get_model=CorporationEntityGet,
    post_model=CorporationEntityPost,
    patch_model=CorporationEntityPatch,
    fields={
        "type": OrdinaryModelField(),
        "name": OrdinaryModelField(),
        "description": OrdinaryModelField(),
        "scenarios": ChildrenModelField(
            ChildrenModelFieldParams(
                include_post_and_patch=True,
                get_mapper=entity_scenario_get_mapper,
            )
        ),
    },
)

router = APIRouter(
    prefix="/entities",
    tags=["entities"],
)

EntityGet = Union[IndividualEntityGet, CorporationEntityGet]
EntityPost = Union[IndividualEntityPost, CorporationEntityPost]
EntityPatch = Union[IndividualEntityPatch, CorporationEntityPatch]

TypedCollection(
    table_model=Entity,
    order_by=Entity.name,
    get_model=EntityGet,
    post_model=EntityPost,
    patch_model=EntityPatch,
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
