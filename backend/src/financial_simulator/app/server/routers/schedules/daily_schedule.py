from typing import Literal

from financial_simulator.app.database.schema import DailySchedule
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
)
from .schedule import ScheduleGet, SchedulePost, schedule_model_fields

DailyScheduleType = Literal["daily_schedule"]


class DailySchedulePost(SchedulePost):
    type: DailyScheduleType


class DailyScheduleGet(ScheduleGet):
    type: DailyScheduleType


daily_schedule_model_mapper = ModelMapper[
    DailySchedule,
    DailyScheduleGet,
    DailySchedulePost,
](
    table_model=DailySchedule,
    get_model=DailyScheduleGet,
    post_model=DailySchedulePost,
    fields={
        **schedule_model_fields,
    },
)
