import logging
from typing import Sequence

import uvicorn
from fastapi import FastAPI
from sqlalchemy import select

from financial_simulator.app.config import Config
from financial_simulator.app.database.schema import Scenario
from financial_simulator.app.server.globals import (
    init_globals,
    DBSessionDependency,
)

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


def start_server(config: Config):
    init_globals(config)
    uvicorn.run(app, port=5000)
