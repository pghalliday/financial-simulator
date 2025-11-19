from typing import Sequence
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    ScheduledProvider,
    AllSchedule,
    AnySchedule,
)
from financial_simulator.app.server.routers.common import typed_collection
from financial_simulator.app.server.util.model_mapper import (
    GetMapper,
    OrdinaryGetField,
    OrdinaryModelField,
    ChildrenModelField,
    AssociationModelField,
    AssociationModelFieldParams,
)


class SchedulePost(typed_collection.TypedBaseModel):
    name: str
    description: str | None = None


class ScheduleScheduledProviderGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class ScheduleAllScheduleGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class ScheduleAnyScheduleGet(BaseModel):
    id: UUID
    name: str
    description: str | None


class ScheduleGet(typed_collection.TypedBaseModel):
    id: UUID
    name: str
    description: str | None
    scheduled_providers: Sequence[ScheduleScheduledProviderGet]
    all_schedules: Sequence[ScheduleAllScheduleGet]
    any_schedules: Sequence[ScheduleAnyScheduleGet]


schedule_scheduled_provider_get_mapper = GetMapper(
    table_model=ScheduledProvider,
    get_model=ScheduleScheduledProviderGet,
    fields={
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

schedule_all_schedule_get_mapper = GetMapper(
    table_model=AllSchedule,
    get_model=ScheduleAllScheduleGet,
    fields={
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

schedule_any_schedule_get_mapper = GetMapper(
    table_model=AnySchedule,
    get_model=ScheduleAnyScheduleGet,
    fields={
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

schedule_model_fields = {
    "type": OrdinaryModelField(),
    "name": OrdinaryModelField(),
    "description": OrdinaryModelField(),
    "scheduled_providers": ChildrenModelField(schedule_scheduled_provider_get_mapper),
    "all_schedules": AssociationModelField(
        association_field="all_schedule",
        params=AssociationModelFieldParams(
            get_mapper=schedule_all_schedule_get_mapper,
        )
    ),
    "any_schedules": AssociationModelField(
        association_field="any_schedule",
        params=AssociationModelFieldParams(
            get_mapper=schedule_any_schedule_get_mapper,
        ),
    ),
}
