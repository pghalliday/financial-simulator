import logging
from contextlib import contextmanager
from typing import Any
from uuid import UUID

import dash
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.component_ids import (
    LOCATION_ID,
    SCENARIOS_LIST_ID,
)
from financial_simulator.app.dashboard.components.list import create_list
from financial_simulator.app.dashboard.components.list.list import create_list_callbacks
from financial_simulator.app.dashboard.globals import get_db_engine
from financial_simulator.app.database.schema import Scenario

SCENARIO_TYPES = None
SCENARIO_LABEL = "scenario"
SCENARIO_ROOT_HREF = "/scenarios/"

logger = logging.getLogger(__name__)

dash.register_page(
    __name__,
    order=1,
    path="/scenarios",
    name="Scenarios",
    title="Scenarios",
    match_path=lambda path: path == "/scenarios",
    header_data=lambda _: {
        "title": "Scenarios",
        "breadcrumbs": [
            {"label": "Home", "href": "/"},
            {"label": "Scenarios", "href": "/scenarios"},
        ],
    },
)


@contextmanager
def get_scenarios():
    with Session(get_db_engine()) as session:
        yield session.query(Scenario).all()


@contextmanager
def add_scenario(add_action_data: Any):
    with Session(get_db_engine()) as session:
        scenario = Scenario(
            name=add_action_data["name"], description=add_action_data["description"]
        )
        session.add(scenario)
        session.commit()
        yield scenario


@contextmanager
def delete_scenario(scenario_id: UUID):
    with Session(get_db_engine()) as session:
        scenario = session.get(Scenario, scenario_id)
        if scenario is not None:
            session.delete(scenario)
            session.commit()
        yield scenario


create_list_callbacks(
    SCENARIOS_LIST_ID,
    SCENARIO_ROOT_HREF,
    SCENARIO_LABEL,
    SCENARIO_TYPES,
    LOCATION_ID,
    add_scenario,
    delete_scenario,
)


def layout():
    return create_list(
        SCENARIOS_LIST_ID,
        SCENARIO_ROOT_HREF,
        SCENARIO_LABEL,
        SCENARIO_TYPES,
        get_scenarios,
    )
