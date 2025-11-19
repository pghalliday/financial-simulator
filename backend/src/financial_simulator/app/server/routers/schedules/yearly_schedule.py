from typing import Literal

from financial_simulator.app.database.schema import YearlySchedule
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, schedule_model_fields

YearlyScheduleType = Literal["yearly_schedule"]


class YearlySchedulePost(SchedulePost):
    type: YearlyScheduleType
    month: int | None = None
    day: int | None = None


class YearlyScheduleGet(ScheduleGet):
    type: YearlyScheduleType
    month: int | None
    day: int | None


yearly_schedule_model_mapper = ModelMapper[
    YearlySchedule,
    YearlyScheduleGet,
    YearlySchedulePost,
](
    table_model=YearlySchedule,
    get_model=YearlyScheduleGet,
    post_model=YearlySchedulePost,
    fields={
        **schedule_model_fields,
        "month": OrdinaryModelField(),
        "day": OrdinaryModelField(),
    },
)
