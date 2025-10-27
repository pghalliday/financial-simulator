import logging
from typing import Optional
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
    FieldRelation,
    OptionalRelatedModelField,
    OrdinaryModelField,
    RelatedModelField,
)

logger = logging.getLogger(__name__)

class BankAccountPost(BaseModel):
    name: str
    description: str
    asset_account_id: UUID
    interest_income_account_id: UUID
    interest_receivable_account_id: UUID
    fee_expenses_account_id: UUID
    fees_payable_account_id: UUID
    fees_provider_id: Optional[UUID] = None
    fee_payment_schedule_id: Optional[UUID] = None
    rate_provider_id: Optional[UUID] = None
    interest_payment_schedule_id: Optional[UUID] = None

class BankAccountPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    asset_account_id: Optional[UUID] = None
    interest_income_account_id: Optional[UUID] = None
    interest_receivable_account_id: Optional[UUID] = None
    fee_expenses_account_id: Optional[UUID] = None
    fees_payable_account_id: Optional[UUID] = None
    fees_provider_id: Optional[UUID] = None
    fee_payment_schedule_id: Optional[UUID] = None
    rate_provider_id: Optional[UUID] = None
    interest_payment_schedule_id: Optional[UUID] = None

class BankAccountGet(BaseModel):
    id: UUID
    name: str
    description: str
    asset_account_id: UUID
    interest_income_account_id: UUID
    interest_receivable_account_id: UUID
    fee_expenses_account_id: UUID
    fees_payable_account_id: UUID
    fees_provider_id: Optional[UUID]
    fee_payment_schedule_id: Optional[UUID]
    rate_provider_id: Optional[UUID]
    interest_payment_schedule_id: Optional[UUID]

router = APIRouter(
    prefix="/bank-accounts",
    tags=["bank-accounts"],
)

model_mapper = ModelMapper(
    table_model=BankAccount,
    get_model=BankAccountGet,
    post_model=BankAccountPost,
    patch_model=BankAccountPatch,
    fields={
        "name": OrdinaryModelField(),
        "description": OrdinaryModelField(),
        "asset_account_id": RelatedModelField(
            FieldRelation(field="asset_account", model=LedgerAccount)
        ),
        "interest_income_account_id": RelatedModelField(
            FieldRelation(field="interest_income_account", model=LedgerAccount)
        ),
        "interest_receivable_account_id": RelatedModelField(
            FieldRelation(field="interest_receivable_account", model=LedgerAccount)
        ),
        "fee_expenses_account_id": RelatedModelField(
            FieldRelation(field="fee_expenses_account", model=LedgerAccount)
        ),
        "fees_payable_account_id": RelatedModelField(
            FieldRelation(field="fees_payable_account", model=LedgerAccount)
        ),
        "fees_provider_id": OptionalRelatedModelField(
            FieldRelation(field="fees_provider", model=Provider)
        ),
        "fee_payment_schedule_id": OptionalRelatedModelField(
            FieldRelation(field="fee_payment_schedule", model=Schedule)
        ),
        "rate_provider_id": OptionalRelatedModelField(
            FieldRelation(field="rate_provider", model=Provider)
        ),
        "interest_payment_schedule_id": OptionalRelatedModelField(
            FieldRelation(field="interest_payment_schedule", model=Schedule)
        ),
    },
)

Collection(
    order_by=BankAccount.name,
    model_mapper=model_mapper,
).add_endpoints(
    router=router,
)
