import logging
from typing import Sequence

from fastapi import FastAPI
from financial_simulator.app.database.schema import Scenario
from sqlalchemy import select

from .environment import DBSessionDependency

logger = logging.getLogger(__name__)
app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/scenarios")
def scenarios_list(session: DBSessionDependency) -> Sequence[str]:
    scenarios = session.execute(select(Scenario).order_by(Scenario.name)).scalars()
    logger.info(scenarios)
    return [scenario.name for scenario in scenarios]
