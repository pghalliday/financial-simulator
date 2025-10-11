import logging
from typing import Sequence, Annotated, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.exc import IntegrityError

from financial_simulator.app.database.schema import Scenario
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..dependencies import get_db_session

logger = logging.getLogger(__name__)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

router = APIRouter(
    prefix="/scenarios",
    tags=["scenarios"],
    responses={404: {"description": "Not found"}},
)

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

@router.get("/")
async def get_scenarios(session: DBSessionDependency) -> Sequence[ScenarioGet]:
    scenarios = session.scalars(select(Scenario))
    return [ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    ) for scenario in scenarios]

@router.get("/{scenario_id}")
async def get_scenario(scenario_id: UUID, session: DBSessionDependency) -> ScenarioGet:
    scenario = session.get(Scenario, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    )

@router.post("/")
async def post_scenario(scenario_post: ScenarioPost, session: DBSessionDependency) -> ScenarioGet:
    try:
        scenario = Scenario(
            name=scenario_post.name,
            description=scenario_post.description
        )
        session.add(scenario)
        session.commit()
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Scenario already exists")
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description
    )

@router.put("/{scenario_id}")
async def patch_scenario(scenario_id: UUID, scenario_post: ScenarioPost, session: DBSessionDependency) -> ScenarioGet:
    try:
        scenario = Scenario(
            id=scenario_id,
            name=scenario_post.name,
            description=scenario_post.description
        )
        merged = session.merge(scenario)
        session.commit()
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Scenario already exists")
    return ScenarioGet(
        id=merged.id,
        name=merged.name,
        description=merged.description,
    )

@router.patch("/{scenario_id}")
async def patch_scenario(scenario_id: UUID, scenario_patch: ScenarioPatch, session: DBSessionDependency) -> ScenarioGet:
    try:
        scenario = Scenario(id=scenario_id)
        if scenario_patch.name:
            scenario.name = scenario_patch.name
        if scenario_patch.description:
            scenario.description = scenario_patch.description
        merged = session.merge(scenario)
        session.commit()
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Scenario already exists")
    return ScenarioGet(
        id=merged.id,
        name=merged.name,
        description=merged.description,
    )
