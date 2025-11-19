from typing import Literal, Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    AllSchedule,
    Schedule,
    AllScheduleSchedule,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    GetMapper,
    OrdinaryGetField,
    AssociationModelField,
    AssociationReference,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields

AllScheduleType = Literal["all_schedule"]


class AllSchedulePost(SchedulePost):
    type: AllScheduleType
    schedules: Sequence[AssociationReference]


class AllScheduleScheduleGet(BaseModel):
    id: UUID
    type: str
    name: str
    description: str | None


class AllScheduleGet(ScheduleGet):
    type: AllScheduleType
    schedules: Sequence[AllScheduleScheduleGet]


all_schedule_schedule_get_mapper = GetMapper(
    table_model=Schedule,
    get_model=AllScheduleScheduleGet,
)
(
    all_schedule_schedule_get_mapper
    .field("type", OrdinaryGetField())
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)


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
        get_mapper=all_schedule_schedule_get_mapper,
    ))
)
