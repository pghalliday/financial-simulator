from typing import Mapping, Sequence

from dash import Input, Output, callback
from dash_mantine_components import MultiSelect  # type: ignore
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.globals import get_engine
from financial_simulator.app.database.schema import Scenario


def create_scenario_selector(component_id: str) -> MultiSelect:
    @callback(
        Output(component_id, "data"),
        Input(component_id, "data"),
    )
    def initialize_selected_scenarios(_) -> Sequence[Mapping[str, str]]:
        with Session(get_engine()) as session:
            scenarios = session.query(Scenario).all()
            return [
                {"value": str(scenario.id), "label": scenario.name}
                for scenario in scenarios
            ]

    return MultiSelect(
        label="Scenarios",
        placeholder="Select Scenarios",
        id=component_id,
    )
