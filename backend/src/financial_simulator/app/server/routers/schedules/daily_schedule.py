from typing import Literal

from financial_simulator.app.database.schema import DailySchedule
from financial_simulator.app.database.schema.schedule.schedule_type import ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

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
