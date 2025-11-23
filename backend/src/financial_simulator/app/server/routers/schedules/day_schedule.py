from datetime import date
from typing import Literal

from financial_simulator.app.database.schema import DaySchedule
from financial_simulator.app.database.schema.schedule.schedule_type import ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

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
