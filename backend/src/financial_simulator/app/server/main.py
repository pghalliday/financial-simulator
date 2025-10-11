import logging

from fastapi import FastAPI
from .routers import scenarios


logger = logging.getLogger(__name__)
app = FastAPI()
app.include_router(scenarios.router)
