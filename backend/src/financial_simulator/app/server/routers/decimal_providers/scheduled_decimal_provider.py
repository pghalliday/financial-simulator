from decimal import Decimal
from typing import Literal
from uuid import UUID

from financial_simulator.app.database.schema import (
    DecimalProviderType,
    ScheduledDecimalProvider,
    Schedule,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    ParentModelField,
    OrdinaryModelField,
)
from .decimal_provider import DecimalProviderGet, DecimalProviderPost, add_decimal_provider_model_fields
from financial_simulator.app.server.routers.schedules.schedule_dependent import (
    ScheduleDependentGet,
    schedule_dependent_get_mapper,
)


class ScheduledDecimalProviderPost(DecimalProviderPost):
    type: Literal[DecimalProviderType.SCHEDULED]
    value: Decimal | None = None
    schedule_id: UUID | None = None


class ScheduledDecimalProviderGet(DecimalProviderGet):
    type: Literal[DecimalProviderType.SCHEDULED]
    value: Decimal | None
    schedule_id: UUID | None
    schedule: ScheduleDependentGet | None


scheduled_provider_model_mapper = ModelMapper(
    table_model=ScheduledDecimalProvider,
    get_model=ScheduledDecimalProviderGet,
    post_model=ScheduledDecimalProviderPost,
)
(
    add_decimal_provider_model_fields(scheduled_provider_model_mapper)
    .field("value", OrdinaryModelField())
    .field("schedule_id", OptionalRelatedModelField(
        field="schedule", model=Schedule
    ))
    .field("schedule", ParentModelField(schedule_dependent_get_mapper))
)
