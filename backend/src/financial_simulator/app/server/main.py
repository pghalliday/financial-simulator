import logging
import os

from fastapi import FastAPI, Request, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError

from .errors import DatabaseIntegrityError
from .routers import (
    scenarios,
    entities,
    dummy_days,
    ledger_accounts,
    bank_accounts,
    rates,
    schedules,
    rate_providers,
    decimal_providers,
)
from .server import LOG_LEVEL_ENV_VAR

log_level = os.environ.get(LOG_LEVEL_ENV_VAR)
logging.basicConfig(level=log_level)

logger = logging.getLogger(__name__)

app = FastAPI(separate_input_output_schemas=False)

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(IntegrityError)
async def db_integrity_error_exception_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    raise HTTPException(status_code=409, detail=jsonable_encoder(DatabaseIntegrityError(message=str(exc))))


app.include_router(scenarios.router)
app.include_router(entities.router)
app.include_router(entities.individual_entity_router)
app.include_router(entities.corporation_entity_router)
app.include_router(bank_accounts.router)
app.include_router(ledger_accounts.router)
app.include_router(rates.router)
app.include_router(rates.periodic_rate_router)
app.include_router(rates.continuous_rate_router)
app.include_router(rates.banded_rate_router)
app.include_router(schedules.router)
app.include_router(schedules.daily_schedule_router)
app.include_router(schedules.day_schedule_router)
app.include_router(schedules.weekly_schedule_router)
app.include_router(schedules.monthly_schedule_router)
app.include_router(schedules.yearly_schedule_router)
app.include_router(schedules.from_schedule_router)
app.include_router(schedules.until_schedule_router)
app.include_router(schedules.range_schedule_router)
app.include_router(schedules.all_schedule_router)
app.include_router(schedules.any_schedule_router)
app.include_router(rate_providers.router)
app.include_router(rate_providers.scheduled_rate_provider_router)
app.include_router(rate_providers.merge_rate_provider_router)
app.include_router(rate_providers.next_rate_provider_router)
app.include_router(decimal_providers.router)
app.include_router(decimal_providers.scheduled_decimal_provider_router)
app.include_router(decimal_providers.merge_decimal_provider_router)
app.include_router(decimal_providers.next_decimal_provider_router)
app.include_router(dummy_days.router)
