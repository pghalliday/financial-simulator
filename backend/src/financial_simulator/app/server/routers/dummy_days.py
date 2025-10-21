from __future__ import annotations
import logging
from decimal import Decimal
from itertools import islice
from typing import Sequence, Tuple, Literal, Union
from datetime import date

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, RootModel, Field

from financial_simulator.app.dummy_days import init_dummy_days
from financial_simulator.lib.accounting import Account
from financial_simulator.lib.entities import Entity

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/dummy-days",
    tags=["dummy-days"],
)

class SseEvent(BaseModel):
    def model_dump_sse(self) -> str:
        return f"data: {self.model_dump_json()}\n\n"

class DummyDayAccount(BaseModel):
    name: str
    sub_accounts: Sequence[DummyDayAccount]
    balance: Decimal
    total_balance: Decimal

class DummyDayEntity(BaseModel):
    name: str
    ledger: DummyDayAccount

class DummyDayDay(BaseModel):
    date: date
    entities: Sequence[DummyDayEntity]

class DummyDayDayEvent(SseEvent):
    type: Literal["day"] = "day"
    idx: int
    day: DummyDayDay

class DummyDayEndEvent(SseEvent):
    type: Literal["end"] = "end"

class DummyDayError(BaseModel):
    status_code: int
    message: str

class DummyDayErrorEvent(SseEvent):
    type: Literal["error"] = "error"
    error: DummyDayError

class DummyDayEvent(RootModel):
    root: Union[DummyDayDayEvent, DummyDayEndEvent, DummyDayErrorEvent] = Field(discriminator='type')

    model_config = {
        "json_schema_extra": {
            "examples": [
                DummyDayDayEvent(
                    idx=0,
                    day=DummyDayDay(
                        date=date.today(),
                        entities=[DummyDayEntity(
                            name="entity name",
                            ledger=DummyDayAccount(
                                name="ledger",
                                balance=Decimal("100"),
                                total_balance=Decimal("200"),
                                sub_accounts=[DummyDayAccount(
                                    name="sub_account",
                                    balance=Decimal("100"),
                                    total_balance=Decimal("100"),
                                    sub_accounts=[],
                                )]
                            )
                        )]
                    )
                ).model_dump_json(indent=2)
            ]
        }
    }

class SseResponse(StreamingResponse):
    media_type = "text/event-stream"

def map_account(account: Account) -> DummyDayAccount:
    return DummyDayAccount(
        name=account.name,
        sub_accounts=[map_account(sub_account) for sub_account in account.sub_accounts],
        balance=account.balance,
        total_balance=account.total_balance,
    )

def map_day(day: Tuple[date, Sequence[Entity]]) -> DummyDayDay:
    return DummyDayDay(
        date=day[0],
        entities=[DummyDayEntity(
            name=entity.name,
            ledger=map_account(entity.books.ledger),
        ) for entity in day[1]],
    )

def generate_events(start: int, end: int):
    try:
        fs = init_dummy_days()
        for idx, day in enumerate(islice(fs, start, end), start=start):
            yield DummyDayDayEvent(
                idx=idx,
                day=map_day(day),
            ).model_dump_sse()
        yield DummyDayEndEvent().model_dump_sse()
    except:
        yield DummyDayErrorEvent(
            error=DummyDayError(
                status_code=500,
                message="Internal Server Error"
            ).model_dump_sse(),
        )
        raise

@router.get(
    "/",
    response_class=SseResponse,
    responses={
        200: {
            "model": DummyDayEvent,
        }
    },
)
async def get(start: int = 0, end: int = 0):
    return generate_events(start, end)
