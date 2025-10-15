import json
import logging
from decimal import Decimal
from itertools import islice
from typing import Sequence, Self, Tuple
from datetime import date

from fastapi import APIRouter
from pydantic import BaseModel
from sse_starlette import EventSourceResponse

from financial_simulator.app.dummy_days import init_dummy_days
from financial_simulator.lib.accounting import Account
from financial_simulator.lib.entities import Entity

logger = logging.getLogger(__name__)

ERROR_ID = -1

router = APIRouter(
    prefix="/dummy-days",
    tags=["dummy_days"],
)

class AccountDayGet(BaseModel):
    name: str
    sub_accounts: Sequence[Self]
    balance: Decimal
    total_balance: Decimal

class EntityDayGet(BaseModel):
    name: str
    ledger: AccountDayGet

class DayGet(BaseModel):
    date: date
    entities: Sequence[EntityDayGet]

def map_account(account: Account) -> AccountDayGet:
    return AccountDayGet(
        name=account.name,
        sub_accounts=[map_account(sub_account) for sub_account in account.sub_accounts],
        balance=account.balance,
        total_balance=account.total_balance,
    )

def map_day(day: Tuple[date, Sequence[Entity]]) -> DayGet:
    return DayGet(
        date=day[0],
        entities=[EntityDayGet(
            name=entity.name,
            ledger=map_account(entity.books.ledger),
        ) for entity in day[1]],
    )

def generate_events(start: int, end: int):
    try:
        fs = init_dummy_days()
        for idx, day in enumerate(islice(fs, start, end), start=start):
            yield {
                "id": f"{idx}",
                "event": "day",
                "data": map_day(day).model_dump_json(),
            }
        yield {
            "id": f"{end}",
            "event": "end",
            "data": "",
        }
    except:
        yield {
            "id": f"{ERROR_ID}",
            "event": "error",
            "data": json.dumps(
                {"status_code": 500, "message": "Internal Server Error"}
            ),
        }
        raise


@router.get("/")
async def get(start: int = 0, end: int = 0) -> EventSourceResponse:
    return EventSourceResponse(generate_events(start, end))
