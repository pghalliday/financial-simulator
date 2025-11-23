from typing import Literal
from uuid import UUID

from financial_simulator.app.database.schema import (
    Value,
    ScheduledProvider,
    Schedule,
)
from financial_simulator.app.database.schema.provider.provider_type import ProviderType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    ParentModelField,
)
from .provider import ProviderGet, ProviderPost, add_provider_model_fields
from financial_simulator.app.server.routers.schedules.schedule_dependent import (
    ScheduleDependentGet,
    schedule_dependent_get_mapper,
)
from financial_simulator.app.server.routers.values.value_dependent import (
    ValueDependentGet,
    value_dependent_get_mapper,
)


class ScheduledProviderPost(ProviderPost):
    type: Literal[ProviderType.SCHEDULED]
    value_id: UUID | None = None
    schedule_id: UUID | None = None


class ScheduledProviderGet(ProviderGet):
    type: Literal[ProviderType.SCHEDULED]
    value_id: UUID | None
    schedule_id: UUID | None
    value: ValueDependentGet | None
    schedule: ScheduleDependentGet | None


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
    .field("value", ParentModelField(value_dependent_get_mapper))
    .field("schedule", ParentModelField(schedule_dependent_get_mapper))
)
