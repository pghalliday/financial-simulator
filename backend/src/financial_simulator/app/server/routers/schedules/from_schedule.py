from datetime import date
from typing import Literal

from financial_simulator.app.database.schema import FromSchedule
from financial_simulator.app.database.schema.schedule.schedule_type import ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

class FromSchedulePost(SchedulePost):
    type: Literal[ScheduleType.FROM]
    from_date: date | None = None


class FromScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.FROM]
    from_date: date | None


from_schedule_model_mapper = ModelMapper(
    table_model=FromSchedule,
    get_model=FromScheduleGet,
    post_model=FromSchedulePost,
)
(
    add_schedule_model_fields(from_schedule_model_mapper)
    .field("from_date", OrdinaryModelField())
)
