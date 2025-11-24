from typing import Literal
from uuid import UUID

from financial_simulator.app.database.schema import (
    RateProviderType,
    ScheduledRateProvider,
    Schedule,
    Rate,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    ParentModelField,
)
from .rate_provider import RateProviderGet, RateProviderPost, add_rate_provider_model_fields
from financial_simulator.app.server.routers.schedules.schedule_dependent import (
    ScheduleDependentGet,
    schedule_dependent_get_mapper,
)
from ..rates.rate_dependent import RateDependentGet, rate_dependent_get_mapper


class ScheduledRateProviderPost(RateProviderPost):
    type: Literal[RateProviderType.SCHEDULED]
    rate_id: UUID | None = None
    schedule_id: UUID | None = None


class ScheduledRateProviderGet(RateProviderGet):
    type: Literal[RateProviderType.SCHEDULED]
    rate_id: UUID | None
    schedule_id: UUID | None
    rate: RateDependentGet | None
    schedule: ScheduleDependentGet | None


scheduled_provider_model_mapper = ModelMapper(
    table_model=ScheduledRateProvider,
    get_model=ScheduledRateProviderGet,
    post_model=ScheduledRateProviderPost,
)
(
    add_rate_provider_model_fields(scheduled_provider_model_mapper)
    .field("rate_id", OptionalRelatedModelField(
        field="rate", model=Rate
    ))
    .field("schedule_id", OptionalRelatedModelField(
        field="schedule", model=Schedule
    ))
    .field("rate", ParentModelField(rate_dependent_get_mapper))
    .field("schedule", ParentModelField(schedule_dependent_get_mapper))
)
