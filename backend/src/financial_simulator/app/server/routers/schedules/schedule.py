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
    AssociationModelField, ModelMapper,
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
)
(
    schedule_scheduled_provider_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

schedule_all_schedule_get_mapper = GetMapper(
    table_model=AllSchedule,
    get_model=ScheduleAllScheduleGet,
)
(
    schedule_all_schedule_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

schedule_any_schedule_get_mapper = GetMapper(
    table_model=AnySchedule,
    get_model=ScheduleAnyScheduleGet,
)
(
    schedule_any_schedule_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

def add_schedule_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper
        .field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("scheduled_providers", ChildrenModelField(schedule_scheduled_provider_get_mapper))
        .field("all_schedules", AssociationModelField(
            association_field="all_schedule",
            get_mapper=schedule_all_schedule_get_mapper,
        ))
        .field("any_schedules", AssociationModelField(
            association_field="any_schedule",
            get_mapper=schedule_any_schedule_get_mapper,
        ))
    )
