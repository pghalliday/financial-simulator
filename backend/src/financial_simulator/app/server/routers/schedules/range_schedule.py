from datetime import date
from typing import Literal

from financial_simulator.app.database.schema import (
    RangeSchedule,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, schedule_model_fields

RangeScheduleType = Literal["range_schedule"]


class RangeSchedulePost(SchedulePost):
    type: RangeScheduleType
    from_date: date | None = None
    until_date: date | None = None


class RangeScheduleGet(ScheduleGet):
    type: RangeScheduleType
    from_date: date | None
    until_date: date | None


range_schedule_model_mapper = ModelMapper[
    RangeSchedule,
    RangeScheduleGet,
    RangeSchedulePost,
](
    table_model=RangeSchedule,
    get_model=RangeScheduleGet,
    post_model=RangeSchedulePost,
    fields={
        **schedule_model_fields,
        "from_date": OrdinaryModelField(),
        "until_date": OrdinaryModelField(),
    },
)
