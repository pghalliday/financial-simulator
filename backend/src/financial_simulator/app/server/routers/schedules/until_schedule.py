from datetime import date
from typing import Literal

from financial_simulator.app.database.schema import (
    UntilSchedule,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, schedule_model_fields

UntilScheduleType = Literal["until_schedule"]


class UntilSchedulePost(SchedulePost):
    type: UntilScheduleType
    until_date: date | None = None


class UntilScheduleGet(ScheduleGet):
    type: UntilScheduleType
    until_date: date | None


until_schedule_model_mapper = ModelMapper[
    UntilSchedule,
    UntilScheduleGet,
    UntilSchedulePost,
](
    table_model=UntilSchedule,
    get_model=UntilScheduleGet,
    post_model=UntilSchedulePost,
    fields={
        **schedule_model_fields,
        "until_date": OrdinaryModelField(),
    },
)
