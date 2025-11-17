from __future__ import annotations
import logging
from typing import List
from uuid import UUID

from fastapi import APIRouter

from financial_simulator.app.database.schema import LedgerAccount, BankAccount
from pydantic import BaseModel

from .common.collection import Collection
from ..util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
    OptionalRelatedModelField,
    FieldRelation,
    ChildrenModelField,
    ParentModelField,
    GetMapper,
    OrdinaryGetField,
)

logger = logging.getLogger(__name__)

class LedgerAccountPost(BaseModel):
    name: str
    description: str | None = None
    account_name: str
    parent_id: UUID | None = None

class LedgerAccountBankAccountGet(BaseModel):
    id: UUID
    name: str
    description: str | None = None

class LedgerAccountGet(BaseModel):
    id: UUID
    name: str
    description: str | None
    account_name: str
    parent_id: UUID | None
    sub_accounts: List[LedgerAccountGet]
    parent: LedgerAccountGet | None
    bank_account_asset_accounts: List[LedgerAccountBankAccountGet]
    bank_account_interest_income_accounts: List[LedgerAccountBankAccountGet]
    bank_account_interest_receivable_accounts: List[LedgerAccountBankAccountGet]
    bank_account_fee_expenses_accounts: List[LedgerAccountBankAccountGet]
    bank_account_fees_payable_accounts: List[LedgerAccountBankAccountGet]

router = APIRouter(
    prefix="/ledger-accounts",
    tags=["ledger-accounts"],
)

bank_account_get_mapper = GetMapper(
    table_model=BankAccount,
    get_model=LedgerAccountBankAccountGet,
    fields={
        "name": OrdinaryGetField(),
        "description": OrdinaryGetField(),
    },
)

model_mapper = ModelMapper(
    table_model=LedgerAccount,
    get_model=LedgerAccountGet,
    post_model=LedgerAccountPost,
    fields={
        "name": OrdinaryModelField(),
        "description": OrdinaryModelField(),
        "account_name": OrdinaryModelField(),
        "parent_id": OptionalRelatedModelField(
            FieldRelation(field="parent", model=LedgerAccount)
        ),
        "sub_accounts": ChildrenModelField(),
        "parent": ParentModelField(),
        "bank_account_asset_accounts": ChildrenModelField(bank_account_get_mapper),
        "bank_account_interest_income_accounts": ChildrenModelField(bank_account_get_mapper),
        "bank_account_interest_receivable_accounts": ChildrenModelField(bank_account_get_mapper),
        "bank_account_fee_expenses_accounts": ChildrenModelField(bank_account_get_mapper),
        "bank_account_fees_payable_accounts": ChildrenModelField(bank_account_get_mapper),
    },
)

where = LedgerAccount.parent_id == None

Collection(
    model_mapper=model_mapper,
    order_by=LedgerAccount.name,
    where=LedgerAccount.parent_id == None,
).add_endpoints(
    router=router,
)
