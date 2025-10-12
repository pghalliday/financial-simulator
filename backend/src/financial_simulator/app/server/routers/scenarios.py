import logging
from typing import Optional
from uuid import UUID


from financial_simulator.app.database.schema import Scenario
from pydantic import BaseModel

from .common import collection

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

router = collection.create_router(
    prefix="/scenarios",
    tags=["scenarios"],
    table_model=Scenario,
    get_model=ScenarioGet,
    post_model=ScenarioPost,
    patch_model=ScenarioPatch,
    map_item=map_scenario,
)
