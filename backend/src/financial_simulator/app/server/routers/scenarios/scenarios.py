import logging
from typing import Sequence, Union
from uuid import UUID

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import Scenario
from pydantic import BaseModel

from financial_simulator.app.server.util.collection import Collection
from financial_simulator.app.server.routers.entities.entity_dependent import (
    EntityDependentGet,
    entity_dependent_get_mapper,
)
from financial_simulator.app.server.util.dependent_types import DependentPost
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
    ManyToManyModelField,
)
from financial_simulator.app.server.util.query_params import DefaultQueryParams

logger = logging.getLogger(__name__)

class ScenarioPost(BaseModel):
    name: str
    description: str | None = None
    entities: Sequence[DependentPost]

class ScenarioGet(BaseModel):
    id: UUID
    name: str
    description: str | None
    entities: Sequence[EntityDependentGet]


router = APIRouter(
    prefix="/scenarios",
    tags=["scenarios"],
)

model_mapper = ModelMapper(
    table_model=Scenario,
    get_model=ScenarioGet,
    post_model=ScenarioPost
)
(
    model_mapper
    .field("name", OrdinaryModelField())
    .field("description", OrdinaryModelField())
    .field("entities", ManyToManyModelField(
        include_post=True,
        get_mapper=entity_dependent_get_mapper,
    ))
)

class ScenarioQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return Scenario.name

Collection(
    model_mapper=model_mapper,
    query_params_class=ScenarioQueryParams,
).add_endpoints(
    router=router,
)
