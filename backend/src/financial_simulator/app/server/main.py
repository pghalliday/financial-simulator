import logging
import os

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError

from .routers import scenarios, entities
from .server import LOG_LEVEL_ENV_VAR

log_level = os.environ.get(LOG_LEVEL_ENV_VAR)
logging.basicConfig(level=log_level)

logger = logging.getLogger(__name__)

app = FastAPI()

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
    raise HTTPException(status_code=409, detail=str(exc))


app.include_router(scenarios.router)
app.include_router(entities.router)
