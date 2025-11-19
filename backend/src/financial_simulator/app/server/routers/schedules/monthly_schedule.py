from typing import Literal

from financial_simulator.app.database.schema import MonthlySchedule
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, schedule_model_fields

MonthlyScheduleType = Literal["monthly_schedule"]


class MonthlySchedulePost(SchedulePost):
    type: MonthlyScheduleType
    day: int | None = None


class MonthlyScheduleGet(ScheduleGet):
    type: MonthlyScheduleType
    day: int | None


monthly_schedule_model_mapper = ModelMapper[
    MonthlySchedule,
    MonthlyScheduleGet,
    MonthlySchedulePost,
](
    table_model=MonthlySchedule,
    get_model=MonthlyScheduleGet,
    post_model=MonthlySchedulePost,
    fields={
        **schedule_model_fields,
        "day": OrdinaryModelField(),
    },
)
