from typing import Literal, Sequence

from financial_simulator.app.database.schema import (
    AllSchedule,
    AllScheduleSchedule,
)
from financial_simulator.app.database.schema.schedule.schedule_type import ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationModelField,
    AssociationReference,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from financial_simulator.app.server.routers.schedules.schedule_dependent import (
    ScheduleDependentGet,
    schedule_dependent_get_mapper,
)


class AllSchedulePost(SchedulePost):
    type: Literal[ScheduleType.ALL]
    schedules: Sequence[AssociationReference]


class AllScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.ALL]
    schedules: Sequence[ScheduleDependentGet]


all_schedule_model_mapper = ModelMapper(
    table_model=AllSchedule,
    get_model=AllScheduleGet,
    post_model=AllSchedulePost,
)
(
    add_schedule_model_fields(all_schedule_model_mapper)
    .field("schedules", AssociationModelField(
        association_field="schedule",
        association_model=AllScheduleSchedule,
        get_mapper=schedule_dependent_get_mapper,
    ))
)
