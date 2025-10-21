import logging
from typing import Optional, Sequence
from uuid import UUID

from fastapi import APIRouter

from financial_simulator.app.database.schema import LedgerAccount, LedgerAccountComponent
from pydantic import BaseModel

from .common import collection

logger = logging.getLogger(__name__)

class LedgerAccountPost(BaseModel):
    name: str
    description: str
    components: Sequence[str]

class LedgerAccountPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    components: Optional[Sequence[str]] = None

class LedgerAccountGet(BaseModel):
    id: UUID
    name: str
    description: str
    components: Sequence[str]

def map_ledger_account_get(ledger_account: LedgerAccount) -> LedgerAccountGet:
    return LedgerAccountGet(
        id=ledger_account.id,
        name=ledger_account.name,
        description=ledger_account.description,
        components=[component.name for component in ledger_account.components],
    )

def map_ledger_account_post(ledger_account_post: LedgerAccountPost, ledger_account_id:  Optional[UUID] = None) -> LedgerAccount:
    new_ledger_account = LedgerAccount()
    if ledger_account_id is not None:
        new_ledger_account.id = ledger_account_id
    new_ledger_account.name = ledger_account_post.name
    new_ledger_account.description = ledger_account_post.description
    new_ledger_account.components = [LedgerAccountComponent(
        name=component,
    ) for component in ledger_account_post.components]
    return new_ledger_account

def patch_ledger_account(ledger_account, ledger_account_patch: LedgerAccountPatch) -> None:
    updated_data = ledger_account_patch.model_dump(exclude_unset=True)
    for key, value in updated_data.items():
        if key == "components":
            ledger_account.components = [LedgerAccountComponent(
            name=component,
        ) for component in ledger_account_patch.components]
        else:
            setattr(ledger_account, key, value)

router = APIRouter(
    prefix="/ledger-accounts",
    tags=["ledger-accounts"],
)

collection.add_endpoints(
    router=router,
    table_model=LedgerAccount,
    order_by=LedgerAccount.name,
    get_model=LedgerAccountGet,
    post_model=LedgerAccountPost,
    patch_model=LedgerAccountPatch,
    map_item_get=map_ledger_account_get,
    map_item_post=map_ledger_account_post,
    patch_item=patch_ledger_account,
)

