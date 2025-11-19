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
    AssociationModelFieldParams,
    AssociationReference,
)
from .schedule import ScheduleGet, SchedulePost, schedule_model_fields

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
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    }
)


all_schedule_model_mapper = ModelMapper[
    AllSchedule,
    AllScheduleGet,
    AllSchedulePost,
](
    table_model=AllSchedule,
    get_model=AllScheduleGet,
    post_model=AllSchedulePost,
    fields={
        **schedule_model_fields,
        "schedules": AssociationModelField(
            association_field="schedule",
            params=AssociationModelFieldParams(
                association_model=AllScheduleSchedule,
                get_mapper=all_schedule_schedule_get_mapper,
            ),
        ),
    },
)
