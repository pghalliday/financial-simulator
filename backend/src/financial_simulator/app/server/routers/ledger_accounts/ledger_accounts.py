from __future__ import annotations
import logging
from typing import List, Union
from uuid import UUID

from fastapi import APIRouter
from sqlalchemy import ColumnElement
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import LedgerAccount
from pydantic import BaseModel

from financial_simulator.app.server.routers.bank_accounts.bank_account_dependent import \
    bank_account_dependent_get_mapper
from financial_simulator.app.server.util.collection import Collection
from financial_simulator.app.server.util.dependent import DependentGet
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
    OptionalRelatedModelField,
    ChildrenModelField,
    ParentModelField,
    GetMapper,
    OrdinaryGetField,
    ParentGetField,
)
from financial_simulator.app.server.util.query_params import DefaultQueryParams

logger = logging.getLogger(__name__)

class LedgerAccountPost(BaseModel):
    name: str
    description: str | None = None
    account_name: str
    parent_id: UUID | None = None

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
    bank_account_asset_accounts: List[DependentGet]
    bank_account_interest_income_accounts: List[DependentGet]
    bank_account_interest_receivable_accounts: List[DependentGet]
    bank_account_fee_expenses_accounts: List[DependentGet]
    bank_account_fees_payable_accounts: List[DependentGet]

router = APIRouter(
    prefix="/ledger-accounts",
    tags=["ledger-accounts"],
)

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
    .field("parent_id", OptionalRelatedModelField(model=LedgerAccount))
    .field("sub_accounts", ChildrenModelField(model_mapper.get_mapper))
    .field("parent", ParentModelField(ledger_account_parent_get_mapper))
    .field("bank_account_asset_accounts", ChildrenModelField(bank_account_dependent_get_mapper))
    .field("bank_account_interest_income_accounts", ChildrenModelField(bank_account_dependent_get_mapper))
    .field("bank_account_interest_receivable_accounts", ChildrenModelField(bank_account_dependent_get_mapper))
    .field("bank_account_fee_expenses_accounts", ChildrenModelField(bank_account_dependent_get_mapper))
    .field("bank_account_fees_payable_accounts", ChildrenModelField(bank_account_dependent_get_mapper))
)

class LedgerAccountQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return LedgerAccount.name

    def query_where(self) -> Union[ColumnElement[bool], None]:
        return LedgerAccount.parent_id == None

Collection(
    model_mapper=model_mapper,
    query_params_class=LedgerAccountQueryParams,
).add_endpoints(
    router=router,
)
