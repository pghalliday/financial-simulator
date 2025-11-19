from typing import Literal

from financial_simulator.app.database.schema import WeeklySchedule
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

WeeklyScheduleType = Literal["weekly_schedule"]


class WeeklySchedulePost(SchedulePost):
    type: WeeklyScheduleType
    weekday: int | None = None


class WeeklyScheduleGet(ScheduleGet):
    type: WeeklyScheduleType
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
