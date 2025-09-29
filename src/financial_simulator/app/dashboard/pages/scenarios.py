import logging
from contextlib import contextmanager
from uuid import UUID

import dash
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.components.list_page import create_list_page
from financial_simulator.app.dashboard.globals import get_engine
from financial_simulator.app.database.schema import Scenario

logger = logging.getLogger(__name__)

dash.register_page(__name__, order=1)


@contextmanager
def get_scenarios():
    with Session(get_engine()) as session:
        yield session.query(Scenario).all()


@contextmanager
def add_scenario(name: str, description: str):
    with Session(get_engine()) as session:
        scenario = Scenario(name=name, description=description)
        session.add(scenario)
        session.commit()
        yield scenario


@contextmanager
def delete_scenario(scenario_id: UUID):
    with Session(get_engine()) as session:
        scenario = session.get(Scenario, scenario_id)
        if scenario is not None:
            session.delete(scenario)
            session.commit()
        yield scenario


layout = create_list_page(
    "scenarios",
    "scenario",
    get_scenarios,
    add_scenario,
    delete_scenario,
)
