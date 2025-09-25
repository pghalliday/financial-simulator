from typing import Mapping, Sequence

from dash import Input, Output, callback
from dash_mantine_components import MultiSelect  # type: ignore

from financial_simulator.app.dashboard.globals import get_api


def create_scenario_selector(component_id: str) -> MultiSelect:
    @callback(
        Output(component_id, "data"),
        Input(component_id, "data"),
    )
    def initialize_selected_scenarios(_) -> Sequence[Mapping[str, str]]:
        return [
            {"value": str(scenario.id), "label": scenario.name}
            for scenario in get_api().list_scenarios()
        ]

    return MultiSelect(
        label="Scenarios",
        placeholder="Select Scenarios",
        id=component_id,
    )
