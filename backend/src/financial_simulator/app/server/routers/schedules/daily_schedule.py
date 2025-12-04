from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import DailySchedule, ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class DailySchedulePost(SchedulePost):
    type: Literal[ScheduleType.DAILY]


class DailyScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.DAILY]


daily_schedule_model_mapper = ModelMapper(
    table_model=DailySchedule,
    get_model=DailyScheduleGet,
    post_model=DailySchedulePost,
)
add_schedule_model_fields(daily_schedule_model_mapper)


class DailyScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return DailySchedule.name


router = APIRouter(
    prefix="/daily-schedules",
    tags=["daily-schedules"],
)


Collection(
    query_params_class=DailyScheduleQueryParams,
    model_mapper=daily_schedule_model_mapper,
).add_endpoints(
    router=router,
)
