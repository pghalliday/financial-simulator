import logging
from typing import Optional
from uuid import UUID

from fastapi import APIRouter

from financial_simulator.app.database.schema import LedgerAccount
from pydantic import BaseModel

from .common import collection, relation
from ..util import RelatedModelMapper, FieldRelation

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
    parent_id: Optional[UUID] = None

router = APIRouter(
    prefix="/ledger-accounts",
    tags=["ledger-accounts"],
)

model_mapper = RelatedModelMapper(
    table_model=LedgerAccount,
    get_model=LedgerAccountGet,
    post_model=LedgerAccountPost,
    patch_model=LedgerAccountPatch,
    ordinary_fields=[
        "name",
        "description",
        "account_name",
    ],
    related_fields={
    },
    optional_related_fields={
        "parent_id": FieldRelation(field="parent", model=LedgerAccount),
    },
)

where = LedgerAccount.parent_id == None

collection.add_endpoints(
    router=router,
    model_mapper=model_mapper,
    order_by=LedgerAccount.name,
    where=LedgerAccount.parent_id == None,
)

class LedgerAccountSubAccountGet(BaseModel):
    id: UUID
    name: str
    description: str
    account_name: str

class LedgerAccountSubAccountPost(BaseModel):
    id: UUID

def map_ledger_account_sub_account(ledger_account: LedgerAccount) -> LedgerAccountSubAccountGet:
    return LedgerAccountSubAccountGet(
        id=ledger_account.id,
        name=ledger_account.name,
        description=ledger_account.description,
        account_name=ledger_account.account_name,
    )

relation.add_endpoints(
    router=router,
    relation_route="sub-accounts",
    relation_field="sub_accounts",
    table_model=LedgerAccount,
    related_table_model=LedgerAccount,
    get_model=LedgerAccountSubAccountGet,
    post_model=LedgerAccountSubAccountPost,
    map_related_item=map_ledger_account_sub_account,
)
