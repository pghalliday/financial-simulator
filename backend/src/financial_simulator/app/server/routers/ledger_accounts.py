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
    ChildrenModelField,
    ParentModelField,
    GetMapper,
    OrdinaryGetField,
    ParentGetField,
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

class LedgerAccountParentGet(BaseModel):
    id: UUID
    name: str
    description: str | None
    account_name: str
    parent_id: UUID | None
    parent: LedgerAccountParentGet | None

class LedgerAccountGet(BaseModel):
    id: UUID
    name: str
    description: str | None
    account_name: str
    parent_id: UUID | None
    sub_accounts: List[LedgerAccountGet]
    parent: LedgerAccountParentGet | None
    bank_account_asset_accounts: List[LedgerAccountBankAccountGet]
    bank_account_interest_income_accounts: List[LedgerAccountBankAccountGet]
    bank_account_interest_receivable_accounts: List[LedgerAccountBankAccountGet]
    bank_account_fee_expenses_accounts: List[LedgerAccountBankAccountGet]
    bank_account_fees_payable_accounts: List[LedgerAccountBankAccountGet]

router = APIRouter(
    prefix="/ledger-accounts",
    tags=["ledger-accounts"],
)

ledger_account_bank_account_get_mapper = GetMapper(
    table_model=BankAccount,
    get_model=LedgerAccountBankAccountGet,
)
(ledger_account_bank_account_get_mapper
 .field("name", OrdinaryGetField())
 .field("description", OrdinaryGetField()))

ledger_account_parent_get_mapper = GetMapper(
    table_model=LedgerAccount,
    get_model=LedgerAccountParentGet,
)
(
    ledger_account_parent_get_mapper
    .field("name", OrdinaryGetField())
    .field("description", OrdinaryGetField())
    .field("account_name", OrdinaryGetField())
    .field("parent_id", OrdinaryGetField())
    .field("parent", ParentGetField(ledger_account_parent_get_mapper))
)

model_mapper = ModelMapper(
    table_model=LedgerAccount,
    get_model=LedgerAccountGet,
    post_model=LedgerAccountPost,
)
(
    model_mapper
    .field("name", OrdinaryModelField())
    .field("description", OrdinaryModelField())
    .field("account_name", OrdinaryModelField())
    .field("parent_id", OptionalRelatedModelField(field="parent", model=LedgerAccount))
    .field("sub_accounts", ChildrenModelField(model_mapper.get_mapper))
    .field("parent", ParentModelField(ledger_account_parent_get_mapper))
    .field("bank_account_asset_accounts", ChildrenModelField(ledger_account_bank_account_get_mapper))
    .field("bank_account_interest_income_accounts", ChildrenModelField(ledger_account_bank_account_get_mapper))
    .field("bank_account_interest_receivable_accounts", ChildrenModelField(ledger_account_bank_account_get_mapper))
    .field("bank_account_fee_expenses_accounts", ChildrenModelField(ledger_account_bank_account_get_mapper))
    .field("bank_account_fees_payable_accounts", ChildrenModelField(ledger_account_bank_account_get_mapper))
)

Collection(
    model_mapper=model_mapper,
    order_by=LedgerAccount.name,
    where=LedgerAccount.parent_id == None,
).add_endpoints(
    router=router,
)
