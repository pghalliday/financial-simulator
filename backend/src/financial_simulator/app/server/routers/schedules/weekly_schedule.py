from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import WeeklySchedule, ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class WeeklySchedulePost(SchedulePost):
    type: Literal[ScheduleType.WEEKLY]
    weekday: int | None = None


class WeeklyScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.WEEKLY]
    weekday: int | None


weekly_schedule_model_mapper = ModelMapper(
    table_model=WeeklySchedule,
    get_model=WeeklyScheduleGet,
    post_model=WeeklySchedulePost,
)
(
    add_schedule_model_fields(weekly_schedule_model_mapper)
    .field("weekday", OrdinaryModelField())
)


class WeeklyScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return WeeklySchedule.name


router = APIRouter(
    prefix="/weekly-schedules",
    tags=["weekly-schedules"],
)


Collection(
    query_params_class=WeeklyScheduleQueryParams,
    model_mapper=weekly_schedule_model_mapper,
).add_endpoints(
    router=router,
)
