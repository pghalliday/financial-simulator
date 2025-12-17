import logging
from typing import Sequence, Union
from uuid import UUID

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    LedgerAccount,
    BankAccount,
    Schedule,
    DecimalProvider,
    RateProvider,
)
from pydantic import BaseModel

from financial_simulator.app.server.routers.decimal_providers.decimal_provider_dependent import (
    DecimalProviderDependentGet,
    decimal_provider_dependent_get_mapper,
)
from financial_simulator.app.server.routers.rate_providers.rate_provider_dependent import RateProviderDependentGet, \
    rate_provider_dependent_get_mapper
from financial_simulator.app.server.util.collection import Collection
from financial_simulator.app.server.util.dependent import DependentGet
from financial_simulator.app.server.routers.entities.entity_dependent import EntityDependentGet, \
    entity_dependent_get_mapper
from financial_simulator.app.server.routers.ledger_accounts.ledger_account_dependent import \
    ledger_account_dependent_get_mapper
from financial_simulator.app.server.routers.schedules.schedule_dependent import ScheduleDependentGet, \
    schedule_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    OrdinaryModelField,
    ParentModelField,
    AssociationModelField,
)
from financial_simulator.app.server.util.query_params import DefaultQueryParams

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
    interest_rate_provider_id: UUID | None = None
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
    fees_provider: DecimalProviderDependentGet | None
    fee_payment_schedule_id: UUID | None
    fee_payment_schedule: ScheduleDependentGet | None
    interest_rate_provider_id: UUID | None
    interest_rate_provider: RateProviderDependentGet | None
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
        OptionalRelatedModelField(model=LedgerAccount),
    )
    .field("asset_account", ParentModelField(ledger_account_dependent_get_mapper))
    .field(
        "interest_income_account_id",
        OptionalRelatedModelField(model=LedgerAccount),
    )
    .field(
        "interest_income_account", ParentModelField(ledger_account_dependent_get_mapper)
    )
    .field(
        "interest_receivable_account_id",
        OptionalRelatedModelField(model=LedgerAccount),
    )
    .field(
        "interest_receivable_account",
        ParentModelField(ledger_account_dependent_get_mapper),
    )
    .field(
        "fee_expenses_account_id",
        OptionalRelatedModelField(model=LedgerAccount),
    )
    .field(
        "fee_expenses_account", ParentModelField(ledger_account_dependent_get_mapper)
    )
    .field(
        "fees_payable_account_id",
        OptionalRelatedModelField(model=LedgerAccount),
    )
    .field(
        "fees_payable_account", ParentModelField(ledger_account_dependent_get_mapper)
    )
    .field(
        "fees_provider_id",
        OptionalRelatedModelField(model=DecimalProvider),
    )
    .field("fees_provider", ParentModelField(decimal_provider_dependent_get_mapper))
    .field(
        "fee_payment_schedule_id",
        OptionalRelatedModelField(model=Schedule),
    )
    .field("fee_payment_schedule", ParentModelField(schedule_dependent_get_mapper))
    .field(
        "interest_rate_provider_id",
        OptionalRelatedModelField(model=RateProvider),
    )
    .field("interest_rate_provider", ParentModelField(rate_provider_dependent_get_mapper))
    .field(
        "interest_payment_schedule_id",
        OptionalRelatedModelField(model=Schedule),
    )
    .field(
        "interest_payment_schedule",
        ParentModelField(schedule_dependent_get_mapper),
    )
    .field(
        "individual_entities",
        AssociationModelField(association_field="individual_entity", get_mapper=entity_dependent_get_mapper),
    )
    .field(
        "corporation_entities",
        AssociationModelField(association_field="corporation_entity", get_mapper=entity_dependent_get_mapper),
    )
)

class BankAccountQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return BankAccount.name

Collection(
    query_params_class=BankAccountQueryParams,
    model_mapper=model_mapper,
).add_endpoints(
    router=router,
)
