from __future__ import annotations
import logging
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter

from financial_simulator.app.database.schema import LedgerAccount
from pydantic import BaseModel

from .common.collection import Collection
from ..util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
    OptionalRelatedModelField,
    FieldRelation,
    TreeChildrenModelField,
    TreeParentModelField,
)

logger = logging.getLogger(__name__)

class LedgerAccountPost(BaseModel):
    name: str
    description: str
    account_name: str
    parent_id: Optional[UUID] = None

class LedgerAccountPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    account_name: Optional[str] = None
    parent_id: Optional[UUID] = None

class LedgerAccountGet(BaseModel):
    id: UUID
    name: str
    description: str
    account_name: str
    parent_id: Optional[UUID]
    sub_accounts: List[LedgerAccountGet]
    parent: Optional[LedgerAccountGet]

router = APIRouter(
    prefix="/ledger-accounts",
    tags=["ledger-accounts"],
)

model_mapper = ModelMapper(
    table_model=LedgerAccount,
    get_model=LedgerAccountGet,
    post_model=LedgerAccountPost,
    patch_model=LedgerAccountPatch,
    fields={
        "name": OrdinaryModelField(),
        "description": OrdinaryModelField(),
        "account_name": OrdinaryModelField(),
        "parent_id": OptionalRelatedModelField(
            FieldRelation(field="parent", model=LedgerAccount)
        ),
        "sub_accounts": TreeChildrenModelField(),
        "parent": TreeParentModelField(),
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
