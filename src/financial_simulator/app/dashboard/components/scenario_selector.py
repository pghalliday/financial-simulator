import logging
from typing import Mapping, Sequence

import dash_mantine_components as dmc
from dash import Input, Output, State, callback
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.globals import get_db_engine
from financial_simulator.app.database.schema import Scenario

logger = logging.getLogger(__name__)


def create_scenario_selector_callbacks(component_id):
    @callback(
        Output(component_id, "value"),
        Input(component_id, "value"),
        State(component_id, "data"),
    )
    def init_value(
        value: Sequence[str], data: Sequence[Mapping[str, str]]
    ) -> Sequence[str]:
        valid_scenario_ids = [datum["value"] for datum in data]
        return [
            scenario_id for scenario_id in value if scenario_id in valid_scenario_ids
        ]


def create_scenario_selector(component_id: str) -> dmc.MultiSelect:
    with Session(get_db_engine()) as session:
        scenarios = session.query(Scenario).all()
        data = [
            {"value": str(scenario.id), "label": scenario.name}
            for scenario in scenarios
        ]

        return dmc.MultiSelect(
            label="Scenarios",
            placeholder="Select Scenarios",
            id=component_id,
            data=data,
            persistence=True,
        )
