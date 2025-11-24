from datetime import date
from typing import Literal

from financial_simulator.app.database.schema import (
    RangeSchedule,
    ScheduleType,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

class RangeSchedulePost(SchedulePost):
    type: Literal[ScheduleType.RANGE]
    from_date: date | None = None
    until_date: date | None = None


class RangeScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.RANGE]
    from_date: date | None
    until_date: date | None


range_schedule_model_mapper = ModelMapper(
    table_model=RangeSchedule,
    get_model=RangeScheduleGet,
    post_model=RangeSchedulePost,
)
(
    add_schedule_model_fields(range_schedule_model_mapper)
    .field("from_date", OrdinaryModelField())
    .field("until_date", OrdinaryModelField())
)
