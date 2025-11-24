from typing import Literal

from financial_simulator.app.database.schema import MonthlySchedule, ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import (
    ScheduleGet,
    SchedulePost,
    add_schedule_model_fields,
)

class MonthlySchedulePost(SchedulePost):
    type: Literal[ScheduleType.MONTHLY]
    day: int | None = None


class MonthlyScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.MONTHLY]
    day: int | None


monthly_schedule_model_mapper = ModelMapper(
    table_model=MonthlySchedule,
    get_model=MonthlyScheduleGet,
    post_model=MonthlySchedulePost,
)
(
    add_schedule_model_fields(monthly_schedule_model_mapper)
    .field("day", OrdinaryModelField())
)
