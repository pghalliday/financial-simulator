import logging
from typing import Sequence
from uuid import UUID

from fastapi import APIRouter

from financial_simulator.app.database.schema import (
    LedgerAccount,
    BankAccount, Provider, Schedule,
)
from pydantic import BaseModel

from financial_simulator.app.server.routers.common.collection import Collection
from financial_simulator.app.server.routers.common.dependent import DependentGet
from financial_simulator.app.server.routers.entities.entity_dependent import EntityDependentGet, \
    entity_dependent_get_mapper
from financial_simulator.app.server.routers.ledger_accounts.ledger_account_dependent import \
    ledger_account_dependent_get_mapper
from financial_simulator.app.server.routers.providers.provider_dependent import ProviderDependentGet, \
    provider_dependent_get_mapper
from financial_simulator.app.server.routers.schedules.schedule_dependent import ScheduleDependentGet, \
    schedule_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    OrdinaryModelField,
    ParentModelField,
    ManyToManyModelField,
)

logger = logging.getLogger(__name__)

class BankAccountPost(BaseModel):
    name: str
    description: str | None = None
    asset_account_id: UUID | None = None
    interest_income_account_id: UUID | None = None
    interest_receivable_account_id: UUID | None = None
    fee_expenses_account_id: UUID | None = None
    fees_payable_account_id: UUID | None = None
    fees_provider_id: UUID | None = None
    fee_payment_schedule_id: UUID | None = None
    rate_provider_id: UUID | None = None
    interest_payment_schedule_id: UUID | None = None

class BankAccountGet(BaseModel):
    id: UUID
    name: str
    description: str | None
    asset_account_id: UUID | None
    asset_account: DependentGet | None
    interest_income_account_id: UUID | None
    interest_income_account: DependentGet | None
    interest_receivable_account_id: UUID | None
    interest_receivable_account: DependentGet | None
    fee_expenses_account_id: UUID | None
    fee_expenses_account: DependentGet | None
    fees_payable_account_id: UUID | None
    fees_payable_account: DependentGet | None
    fees_provider_id: UUID | None
    fees_provider: ProviderDependentGet | None
    fee_payment_schedule_id: UUID | None
    fee_payment_schedule: ScheduleDependentGet | None
    rate_provider_id: UUID | None
    rate_provider: ProviderDependentGet | None
    interest_payment_schedule_id: UUID | None
    interest_payment_schedule: ScheduleDependentGet | None
    individual_entities: Sequence[EntityDependentGet]
    corporation_entities: Sequence[EntityDependentGet]

router = APIRouter(
    prefix="/bank-accounts",
    tags=["bank-accounts"],
)

model_mapper = ModelMapper(
    table_model=BankAccount,
    get_model=BankAccountGet,
    post_model=BankAccountPost,
)
(
    model_mapper.field("name", OrdinaryModelField())
    .field("description", OrdinaryModelField())
    .field(
        "asset_account_id",
        OptionalRelatedModelField(field="asset_account", model=LedgerAccount),
    )
    .field("asset_account", ParentModelField(ledger_account_dependent_get_mapper))
    .field(
        "interest_income_account_id",
        OptionalRelatedModelField(field="interest_income_account", model=LedgerAccount),
    )
    .field(
        "interest_income_account", ParentModelField(ledger_account_dependent_get_mapper)
    )
    .field(
        "interest_receivable_account_id",
        OptionalRelatedModelField(
            field="interest_receivable_account", model=LedgerAccount
        ),
    )
    .field(
        "interest_receivable_account",
        ParentModelField(ledger_account_dependent_get_mapper),
    )
    .field(
        "fee_expenses_account_id",
        OptionalRelatedModelField(field="fee_expenses_account", model=LedgerAccount),
    )
    .field(
        "fee_expenses_account", ParentModelField(ledger_account_dependent_get_mapper)
    )
    .field(
        "fees_payable_account_id",
        OptionalRelatedModelField(field="fees_payable_account", model=LedgerAccount),
    )
    .field(
        "fees_payable_account", ParentModelField(ledger_account_dependent_get_mapper)
    )
    .field(
        "fees_provider_id",
        OptionalRelatedModelField(field="fees_provider", model=Provider),
    )
    .field("fees_provider", ParentModelField(provider_dependent_get_mapper))
    .field(
        "fee_payment_schedule_id",
        OptionalRelatedModelField(field="fee_payment_schedule", model=Schedule),
    )
    .field("fee_payment_schedule", ParentModelField(schedule_dependent_get_mapper))
    .field(
        "rate_provider_id",
        OptionalRelatedModelField(field="rate_provider", model=Provider),
    )
    .field("rate_provider", ParentModelField(provider_dependent_get_mapper))
    .field(
        "interest_payment_schedule_id",
        OptionalRelatedModelField(field="interest_payment_schedule", model=Schedule),
    )
    .field(
        "interest_payment_schedule",
        ParentModelField(schedule_dependent_get_mapper),
    )
    .field(
        "individual_entities",
        ManyToManyModelField(get_mapper=entity_dependent_get_mapper),
    )
    .field(
        "corporation_entities",
        ManyToManyModelField(get_mapper=entity_dependent_get_mapper),
    )
)

Collection(
    order_by=BankAccount.name,
    model_mapper=model_mapper,
).add_endpoints(
    router=router,
)
