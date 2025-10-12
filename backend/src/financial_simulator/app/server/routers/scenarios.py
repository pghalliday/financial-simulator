import logging
from typing import Sequence, Annotated, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.params import Depends

from financial_simulator.app.database.schema import Scenario
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..dependencies import get_db_session
from ..errors import HTTPIntegrityError, HTTPNotFoundError, NotFoundError

logger = logging.getLogger(__name__)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

router = APIRouter(
    prefix="/scenarios",
    tags=["scenarios"],
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

@router.get(
    "/",
    response_model=Sequence[ScenarioGet],
)
async def get_scenarios(session: DBSessionDependency):
    scenarios = session.scalars(select(Scenario))
    return [ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    ) for scenario in scenarios]

@router.get(
    "/{scenario_id}",
    response_model=ScenarioGet,
    responses={
        404: {"model": HTTPNotFoundError, "description": "Not found"},
    },
)
async def get_scenario(scenario_id: UUID, session: DBSessionDependency):
    scenario = session.get(Scenario, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail=jsonable_encoder(NotFoundError(id=scenario_id)))
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    )

@router.post(
    "/",
    response_model=ScenarioGet,
    responses={
        409: {"model": HTTPIntegrityError, "description": "Database integrity error"},
    },
)
async def post_scenario(scenario_post: ScenarioPost, session: DBSessionDependency):
    scenario = Scenario(
        name=scenario_post.name,
        description=scenario_post.description,
    )
    session.add(scenario)
    session.commit()
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description
    )

@router.put(
    "/{scenario_id}",
    response_model=ScenarioGet,
    responses={
        409: {"model": HTTPIntegrityError, "description": "Database integrity error"},
    },
)
async def put_scenario(scenario_id: UUID, scenario_post: ScenarioPost, session: DBSessionDependency):
    scenario = Scenario(
        id=scenario_id,
        name=scenario_post.name,
        description=scenario_post.description,
    )
    merged = session.merge(scenario)
    session.commit()
    return ScenarioGet(
        id=merged.id,
        name=merged.name,
        description=merged.description,
    )

@router.patch(
    "/{scenario_id}",
    response_model=ScenarioGet,
    responses={
        404: {"model": HTTPNotFoundError, "description": "Not found"},
        409: {"model": HTTPIntegrityError, "description": "Database integrity error"},
    },
)
async def patch_scenario(scenario_id: UUID, scenario_patch: ScenarioPatch, session: DBSessionDependency):
    scenario = session.get(Scenario, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail=jsonable_encoder(NotFoundError(id=scenario_id)))
    updated_data = scenario_patch.model_dump(exclude_unset=True)
    for key, value in updated_data.items():
        setattr(scenario, key, value)
    session.commit()
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    )
