import logging
from uuid import UUID

from fastapi import APIRouter

from financial_simulator.app.database.schema import (
    LedgerAccount,
    BankAccount, Provider, Schedule,
)
from pydantic import BaseModel

from .common.collection import Collection
from ..util.model_mapper import (
    ModelMapper,
    OptionalRelatedModelField,
    OrdinaryModelField,
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
    interest_income_account_id: UUID | None
    interest_receivable_account_id: UUID | None
    fee_expenses_account_id: UUID | None
    fees_payable_account_id: UUID | None
    fees_provider_id: UUID | None
    fee_payment_schedule_id: UUID | None
    rate_provider_id: UUID | None
    interest_payment_schedule_id: UUID | None

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
    model_mapper
    .field("name", OrdinaryModelField())
    .field("description", OrdinaryModelField())
    .field("asset_account_id", OptionalRelatedModelField(field="asset_account", model=LedgerAccount))
    .field("interest_income_account_id", OptionalRelatedModelField(field="interest_income_account", model=LedgerAccount))
    .field("interest_receivable_account_id", OptionalRelatedModelField(field="interest_receivable_account", model=LedgerAccount))
    .field("fee_expenses_account_id", OptionalRelatedModelField(field="fee_expenses_account", model=LedgerAccount))
    .field("fees_payable_account_id", OptionalRelatedModelField(field="fees_payable_account", model=LedgerAccount))
    .field("fees_provider_id", OptionalRelatedModelField(field="fees_provider", model=Provider))
    .field("fee_payment_schedule_id", OptionalRelatedModelField(field="fee_payment_schedule", model=Schedule))
    .field("rate_provider_id", OptionalRelatedModelField(field="rate_provider", model=Provider))
    .field("interest_payment_schedule_id", OptionalRelatedModelField(field="interest_payment_schedule", model=Schedule))
)

Collection(
    order_by=BankAccount.name,
    model_mapper=model_mapper,
).add_endpoints(
    router=router,
)
