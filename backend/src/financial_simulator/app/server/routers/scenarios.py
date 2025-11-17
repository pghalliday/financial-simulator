import logging
from typing import Literal, Sequence
from uuid import UUID

from fastapi import APIRouter

from financial_simulator.app.database.schema import Scenario, Entity
from pydantic import BaseModel

from .common.collection import Collection
from .common.relation import Relation
from ..util.model_mapper import (
    GetMapper,
    ModelMapper,
    OrdinaryGetField,
    OrdinaryModelField,
    ManyToManyReference,
    ManyToManyModelField,
    ManyToManyModelFieldParams,
)

logger = logging.getLogger(__name__)

class ScenarioPost(BaseModel):
    name: str
    description: str | None = None
    entities: Sequence[ManyToManyReference]

class ScenarioEntityGet(BaseModel):
    id: UUID
    type: Literal["individual_entity", "corporation_entity"]
    name: str
    description: str | None

class ScenarioGet(BaseModel):
    id: UUID
    name: str
    description: str | None
    entities: Sequence[ScenarioEntityGet]

router = APIRouter(
    prefix="/scenarios",
    tags=["scenarios"],
)

scenario_entity_get_mapper = GetMapper(
    table_model=Entity,
    get_model=ScenarioEntityGet,
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

model_mapper = ModelMapper(
    table_model=Scenario,
    get_model=ScenarioGet,
    post_model=ScenarioPost,
    fields={
        "name": OrdinaryModelField(),
        "description": OrdinaryModelField(),
        "entities": ManyToManyModelField(ManyToManyModelFieldParams(
            include_post=True,
            get_mapper=scenario_entity_get_mapper,
        )),
    },
)

Collection(
    model_mapper=model_mapper,
    order_by=Scenario.name,
).add_endpoints(
    router=router,
)

Relation(
    relation_route="entities",
    relation_field="entities",
    table_model=Scenario,
    get_mapper=scenario_entity_get_mapper,
).add_endpoints(
    router=router,
)
