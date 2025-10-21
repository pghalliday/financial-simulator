import logging
from typing import Optional, Literal
from uuid import UUID

from fastapi import APIRouter

from financial_simulator.app.database.schema import Scenario, Entity
from pydantic import BaseModel

from .common import collection, relation

logger = logging.getLogger(__name__)

class ScenarioPost(BaseModel):
    name: str
    description: str

class ScenarioPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ScenarioGet(BaseModel):
    id: UUID
    name: str
    description: str

def map_scenario(scenario: Scenario) -> ScenarioGet:
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    )

router = APIRouter(
    prefix="/scenarios",
    tags=["scenarios"],
)

collection.add_endpoints(
    router=router,
    table_model=Scenario,
    order_by=Scenario.name,
    get_model=ScenarioGet,
    post_model=ScenarioPost,
    patch_model=ScenarioPatch,
    map_item_get=map_scenario,
)

class ScenarioEntityGet(BaseModel):
    id: UUID
    type: Literal["individual_entity", "corporation_entity"]
    name: str
    description: str

class ScenarioEntityPost(BaseModel):
    id: UUID

def map_scenario_entity(entity: Entity) -> ScenarioEntityGet:
    return ScenarioEntityGet(
        id=entity.id,
        type=entity.type,
        name=entity.name,
        description=entity.description,
    )

relation.add_endpoints(
    router=router,
    relation_name="entities",
    table_model=Scenario,
    related_table_model=Entity,
    get_model=ScenarioEntityGet,
    post_model=ScenarioEntityPost,
    map_related_item=map_scenario_entity,
)
