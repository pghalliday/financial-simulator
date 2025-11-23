from typing import Literal, Sequence

from financial_simulator.app.database.schema import (
    AnySchedule,
    AnyScheduleSchedule,
)
from financial_simulator.app.database.schema.schedule.schedule_type import ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationModelField,
    AssociationReference,
)
from .schedule import (
    ScheduleGet,
    SchedulePost,
    add_schedule_model_fields,
)
from financial_simulator.app.server.routers.schedules.schedule_dependent import (
    ScheduleDependentGet,
    schedule_dependent_get_mapper,
)


class AnySchedulePost(SchedulePost):
    type: Literal[ScheduleType.ANY]
    schedules: Sequence[AssociationReference]


class AnyScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.ANY]
    schedules: Sequence[ScheduleDependentGet]


any_schedule_model_mapper = ModelMapper(
    table_model=AnySchedule,
    get_model=AnyScheduleGet,
    post_model=AnySchedulePost,
)
(
    add_schedule_model_fields(any_schedule_model_mapper)
    .field("schedules", AssociationModelField(
        association_field="schedule",
        association_model=AnyScheduleSchedule,
        get_mapper=schedule_dependent_get_mapper,
    ))
)
