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
    FieldRelation,
    ParentModelField,
    GetMapper,
    OrdinaryGetField,
)
from .provider import ProviderGet, ProviderPost, provider_model_fields

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
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

scheduled_provider_schedule_get_mapper = GetMapper(
    table_model=Schedule,
    get_model=ScheduledProviderScheduleGet,
    fields={
        "type": OrdinaryGetField(),
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

scheduled_provider_model_mapper = ModelMapper[
    ScheduledProvider,
    ScheduledProviderGet,
    ScheduledProviderPost,
](
    table_model=ScheduledProvider,
    get_model=ScheduledProviderGet,
    post_model=ScheduledProviderPost,
    fields={
        **provider_model_fields,
        "value_id": OptionalRelatedModelField(
            FieldRelation(field="value", model=Value)
        ),
        "schedule_id": OptionalRelatedModelField(
            FieldRelation(field="schedule", model=Schedule)
        ),
        "value": ParentModelField(scheduled_provider_value_get_mapper),
        "schedule": ParentModelField(scheduled_provider_schedule_get_mapper),
    },
)
