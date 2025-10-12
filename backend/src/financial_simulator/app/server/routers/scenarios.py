import logging
from typing import Sequence, Annotated, Optional
from uuid import UUID

from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
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

class ScenarioNotFound(BaseModel):
    id: UUID

class ScenarioAlreadyExists(BaseModel):
    name: str


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
        404: {"model": ScenarioNotFound, "description": "Scenario not found"},
    },
)
async def get_scenario(scenario_id: UUID, session: DBSessionDependency):
    scenario = session.get(Scenario, scenario_id)
    if not scenario:
        return JSONResponse(
            status_code=404,
            content=jsonable_encoder(ScenarioNotFound(id=scenario_id)),
        )
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    )

@router.post(
    "/",
    response_model=ScenarioGet,
    responses={
        409: {"model": ScenarioAlreadyExists, "description": "Scenario already exists"},
    },
)
async def post_scenario(scenario_post: ScenarioPost, session: DBSessionDependency):
    try:
        scenario = Scenario(
            name=scenario_post.name,
            description=scenario_post.description,
        )
        session.add(scenario)
        session.commit()
    except IntegrityError:
        return JSONResponse(
            status_code=409,
            content=jsonable_encoder(ScenarioAlreadyExists(name=scenario_post.name)),
        )
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description
    )

@router.put(
    "/{scenario_id}",
    response_model=ScenarioGet,
    responses={
        409: {"model": ScenarioAlreadyExists, "description": "Scenario already exists"},
    },
)
async def put_scenario(scenario_id: UUID, scenario_post: ScenarioPost, session: DBSessionDependency):
    try:
        scenario = Scenario(
            id=scenario_id,
            name=scenario_post.name,
            description=scenario_post.description,
        )
        merged = session.merge(scenario)
        session.commit()
    except IntegrityError:
        return JSONResponse(
            status_code=409,
            content=jsonable_encoder(ScenarioAlreadyExists(name=scenario_post.name)),
        )
    return ScenarioGet(
        id=merged.id,
        name=merged.name,
        description=merged.description,
    )

@router.patch(
    "/{scenario_id}",
    response_model=ScenarioGet,
    responses={
        404: {"model": ScenarioNotFound, "description": "Scenario not found"},
        409: {"model": ScenarioAlreadyExists, "description": "Scenario already exists"}
    },
)
async def patch_scenario(scenario_id: UUID, scenario_patch: ScenarioPatch, session: DBSessionDependency):
    try:
        scenario = session.get(Scenario, scenario_id)
        if not scenario:
            return JSONResponse(
                status_code=404,
                content=jsonable_encoder(ScenarioNotFound(id=scenario_id)),
            )
        if scenario_patch.name:
            scenario.name = scenario_patch.name
        if scenario_patch.description:
            scenario.description = scenario_patch.description
        session.commit()
    except IntegrityError:
        return JSONResponse(
            status_code=409,
            content=jsonable_encoder(ScenarioAlreadyExists(name=scenario_patch.name)),
        )
    return ScenarioGet(
        id=scenario.id,
        name=scenario.name,
        description=scenario.description,
    )
