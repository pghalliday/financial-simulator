from datetime import date
from typing import Literal

from financial_simulator.app.database.schema import (
    UntilSchedule,
    ScheduleType,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

class UntilSchedulePost(SchedulePost):
    type: Literal[ScheduleType.UNTIL]
    until_date: date | None = None


class UntilScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.UNTIL]
    until_date: date | None


until_schedule_model_mapper = ModelMapper(
    table_model=UntilSchedule,
    get_model=UntilScheduleGet,
    post_model=UntilSchedulePost,
)
(
    add_schedule_model_fields(until_schedule_model_mapper)
    .field("until_date", OrdinaryModelField())
)
