import logging
from typing import Mapping, Sequence, Tuple

import dash_mantine_components as dmc
from dash import Input, Output, State, callback, dcc
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.globals import get_engine
from financial_simulator.app.database.schema import Scenario

logger = logging.getLogger(__name__)


def create_scenario_selector(component_id: str) -> dmc.Box:
    initial_value_store_id = f"{component_id}-initial-value-store"

    # To work around an issue with the persistence we will
    # store the persisted value in a store and chain a callback
    # to reset the selected values. If we don't do this the persisted
    # state is reset and if we try to set it from this callback it doesn't
    # work,
    #
    # It's as if updating the data always clears the persisted value,
    # and it's not possible to update the data and the selected values at the
    # same time. Possibly this should be raised as a bug against the MultiSelect
    # component
    @callback(
        Output(initial_value_store_id, "data"),
        Output(component_id, "data"),
        Input(component_id, "data"),
        State(component_id, "value"),
    )
    def initialize_selected_scenarios_data(
        _, value: Sequence[str]
    ) -> Tuple[Sequence[str], Sequence[Mapping[str, str]]]:
        with Session(get_engine()) as session:
            scenarios = session.query(Scenario).all()
            return value, [
                {"value": str(scenario.id), "label": scenario.name}
                for scenario in scenarios
            ]

    # Here we reset the persisted values after initializing the data.
    # We also need to filter values that no longer exist in the MultiSelect data
    @callback(
        Output(component_id, "value"),
        Input(initial_value_store_id, "data"),
        State(component_id, "data"),
    )
    def initialize_selected_scenarios_value(
        value: Sequence[str], data: Sequence[Mapping[str, str]]
    ) -> Sequence[str]:
        valid_scenario_ids = [datum["value"] for datum in data]
        return [
            scenario_id for scenario_id in value if scenario_id in valid_scenario_ids
        ]

    return dmc.Box(
        [
            dcc.Store(id=initial_value_store_id),
            dmc.MultiSelect(
                label="Scenarios",
                placeholder="Select Scenarios",
                id=component_id,
                persistence=True,
            ),
        ],
    )
