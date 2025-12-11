import logging
from typing import Annotated, Sequence, List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.server.dependencies import get_db_session
from .ledger_accounts import add_ledger_accounts

router = APIRouter(
    prefix="/init-db",
    tags=["init-db"],
)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

class InitDBGet(BaseModel):
    log: Sequence[str]

@router.get("/")
async def get_init_db_route(session: DBSessionDependency) -> InitDBGet:
    log: List[str] = []
    add_ledger_accounts(session, log)
    session.commit()
    return InitDBGet(log=log)
