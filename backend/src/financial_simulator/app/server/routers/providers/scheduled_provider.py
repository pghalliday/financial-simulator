from typing import Literal
from uuid import UUID

from pydantic import BaseModel

from financial_simulator.app.database.schema import (
    Value,
    ScheduledProvider,
    Schedule,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    ParentModelField,
    GetMapper,
    OrdinaryGetField,
)
from .provider import ProviderGet, ProviderPost, add_provider_model_fields

ScheduledProviderType = Literal["scheduled_provider"]


class ScheduledProviderPost(ProviderPost):
    type: ScheduledProviderType
    value_id: UUID | None = None
    schedule_id: UUID | None = None


class ScheduledProviderValueGet(BaseModel):
    id: UUID
    type: str
    name: str
    description: str | None

class ScheduledProviderScheduleGet(BaseModel):
    id: UUID
    type: str
    name: str
    description: str | None

class ScheduledProviderGet(ProviderGet):
    type: ScheduledProviderType
    value_id: UUID | None
    schedule_id: UUID | None
    value: ScheduledProviderValueGet | None
    schedule: ScheduledProviderScheduleGet | None


scheduled_provider_value_get_mapper = GetMapper(
    table_model=Value,
    get_model=ScheduledProviderValueGet,
)
(
    scheduled_provider_value_get_mapper
    .field("type", OrdinaryGetField())
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

scheduled_provider_schedule_get_mapper = GetMapper(
    table_model=Schedule,
    get_model=ScheduledProviderScheduleGet,
)
(
    scheduled_provider_schedule_get_mapper
    .field("type", OrdinaryGetField())
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
)

scheduled_provider_model_mapper = ModelMapper(
    table_model=ScheduledProvider,
    get_model=ScheduledProviderGet,
    post_model=ScheduledProviderPost,
)
(
    add_provider_model_fields(scheduled_provider_model_mapper)
    .field("value_id", OptionalRelatedModelField(
        field="value", model=Value
    ))
    .field("schedule_id", OptionalRelatedModelField(
        field="schedule", model=Schedule
    ))
    .field("value", ParentModelField(scheduled_provider_value_get_mapper))
    .field("schedule", ParentModelField(scheduled_provider_schedule_get_mapper))
)
