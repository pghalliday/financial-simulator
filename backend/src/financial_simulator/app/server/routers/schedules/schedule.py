from typing import Sequence
from uuid import UUID

from financial_simulator.app.database.schema.schedule.schedule_type import ScheduleType
from financial_simulator.app.server.routers.bank_accounts.bank_account_dependent import \
    bank_account_dependent_get_mapper
from financial_simulator.app.server.routers.common.dependent import DependentGet
from financial_simulator.app.server.routers.common.typed_collection import TypedBaseModel
from financial_simulator.app.server.routers.providers.provider_dependent import ProviderDependentGet, \
    provider_dependent_get_mapper
from financial_simulator.app.server.routers.schedules.schedule_dependent import ScheduleDependentGet, \
    schedule_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    OrdinaryModelField,
    ChildrenModelField,
    AssociationModelField, ModelMapper,
)


class SchedulePost(TypedBaseModel[ScheduleType]):
    name: str
    description: str | None = None


class ScheduleGet(TypedBaseModel[ScheduleType]):
    id: UUID
    name: str
    description: str | None
    scheduled_providers: Sequence[ProviderDependentGet]
    all_schedules: Sequence[ScheduleDependentGet]
    any_schedules: Sequence[ScheduleDependentGet]
    bank_account_fee_payment_schedules: Sequence[DependentGet]
    bank_account_interest_payment_schedules: Sequence[DependentGet]


def add_schedule_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper.field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field("scheduled_providers", ChildrenModelField(provider_dependent_get_mapper))
        .field(
            "all_schedules",
            AssociationModelField(
                association_field="all_schedule",
                get_mapper=schedule_dependent_get_mapper,
            ),
        )
        .field(
            "any_schedules",
            AssociationModelField(
                association_field="any_schedule",
                get_mapper=schedule_dependent_get_mapper,
            ),
        )
        .field(
            "bank_account_fee_payment_schedules",
            ChildrenModelField(bank_account_dependent_get_mapper),
        )
        .field(
            "bank_account_interest_payment_schedules",
            ChildrenModelField(bank_account_dependent_get_mapper),
        )
    )
