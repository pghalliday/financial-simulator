from datetime import date
from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import DaySchedule, ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class DaySchedulePost(SchedulePost):
    type: Literal[ScheduleType.DAY]
    day: date | None = None


class DayScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.DAY]
    day: date | None


day_schedule_model_mapper = ModelMapper(
    table_model=DaySchedule,
    get_model=DayScheduleGet,
    post_model=DaySchedulePost,
)
(
    add_schedule_model_fields(day_schedule_model_mapper)
    .field("day", OrdinaryModelField())
)


class DayScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return DaySchedule.name


router = APIRouter(
    prefix="/day-schedules",
    tags=["day-schedules"],
)


Collection(
    query_params_class=DayScheduleQueryParams,
    model_mapper=day_schedule_model_mapper,
).add_endpoints(
    router=router,
)
