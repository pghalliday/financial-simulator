from typing import Literal

from financial_simulator.app.database.schema import WeeklySchedule
from financial_simulator.app.database.schema.schedule.schedule_type import ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

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
