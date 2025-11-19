from datetime import date
from typing import Literal

from financial_simulator.app.database.schema import DaySchedule
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

DayScheduleType = Literal["day_schedule"]


class DaySchedulePost(SchedulePost):
    type: DayScheduleType
    day: date | None = None


class DayScheduleGet(ScheduleGet):
    type: DayScheduleType
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
