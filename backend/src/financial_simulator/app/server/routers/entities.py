import logging
from typing import Optional, Union, Literal
from uuid import UUID


from financial_simulator.app.database.schema import (
    IndividualEntity,
    CorporationEntity,
    Entity,
)

from .common import typed_collection

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


def map_individual_entity(entity: IndividualEntity) -> IndividualEntityGet:
    return IndividualEntityGet(
        id=entity.id,
        name=entity.name,
        description=entity.description,
        type="individual_entity",
    )

def map_corporation_entity(entity: CorporationEntity) -> CorporationEntityGet:
    return CorporationEntityGet(
        id=entity.id,
        name=entity.name,
        description=entity.description,
        type="corporation_entity",
    )

router = typed_collection.create_router(
    prefix="/entities",
    tags=["entities"],
    base_table_model=Entity,
    order_by=Entity.name,
    table_models={
        "individual_entity": IndividualEntity,
        "corporation_entity": CorporationEntity,
    },
    get_model=Union[IndividualEntityGet, CorporationEntityGet],
    post_model=Union[IndividualEntityPost, CorporationEntityPost],
    patch_model=Union[IndividualEntityPatch, CorporationEntityPatch],
    item_mappers={
        "individual_entity": map_individual_entity,
        "corporation_entity": map_corporation_entity,
    },
)
