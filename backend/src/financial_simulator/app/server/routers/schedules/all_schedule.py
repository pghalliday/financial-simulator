from typing import Literal, Sequence, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    AllSchedule,
    AllScheduleSchedule,
    ScheduleType,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from financial_simulator.app.server.routers.schedules.schedule_dependent import (
    ScheduleDependentGet,
    schedule_dependent_get_mapper,
)
from ...util.collection import Collection
from ...util.dependent_types import DependentPost
from ...util.query_params import DefaultQueryParams


class AllSchedulePost(SchedulePost):
    type: Literal[ScheduleType.ALL]
    schedules: Sequence[DependentPost]


class AllScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.ALL]
    schedules: Sequence[ScheduleDependentGet]


all_schedule_model_mapper = ModelMapper(
    table_model=AllSchedule,
    get_model=AllScheduleGet,
    post_model=AllSchedulePost,
)
(
    add_schedule_model_fields(all_schedule_model_mapper)
    .field("schedules", AssociationModelField(
        association_field="schedule",
        association_model=AllScheduleSchedule,
        get_mapper=schedule_dependent_get_mapper,
    ))
)


class AllScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return AllSchedule.name


router = APIRouter(
    prefix="/all-schedules",
    tags=["all-schedules"],
)


Collection(
    query_params_class=AllScheduleQueryParams,
    model_mapper=all_schedule_model_mapper,
).add_endpoints(
    router=router,
)
