from typing import Literal, Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    Schedule,
    AnySchedule,
    AnyScheduleSchedule,
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

AnyScheduleType = Literal["any_schedule"]


class AnySchedulePost(SchedulePost):
    type: AnyScheduleType
    schedules: Sequence[AssociationReference]


class AnyScheduleScheduleGet(BaseModel):
    id: UUID
    type: str
    name: str
    description: str | None


class AnyScheduleGet(ScheduleGet):
    type: AnyScheduleType
    schedules: Sequence[AnyScheduleScheduleGet]


any_schedule_schedule_get_mapper = GetMapper(
    table_model=Schedule,
    get_model=AnyScheduleScheduleGet,
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    }
)


any_schedule_model_mapper = ModelMapper[
    AnySchedule,
    AnyScheduleGet,
    AnySchedulePost,
](
    table_model=AnySchedule,
    get_model=AnyScheduleGet,
    post_model=AnySchedulePost,
    fields={
        **schedule_model_fields,
        "schedules": AssociationModelField(
            association_field="schedule",
            params=AssociationModelFieldParams(
                association_model=AnyScheduleSchedule,
                get_mapper=any_schedule_schedule_get_mapper,
            ),
        ),
    },
)
