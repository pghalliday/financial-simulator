import logging
import re
from contextlib import contextmanager
from typing import Tuple
from uuid import UUID

import dash
import dash_mantine_components as dmc
from dash import Input, Output, State, callback, dcc
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.globals import get_db_engine
from financial_simulator.app.database.schema import Scenario

logger = logging.getLogger(__name__)

SCENARIO_PATH_REGEX = r"/scenarios/([^/]+)"


@contextmanager
def get_scenario(scenario_id: str):
    with Session(get_db_engine()) as session:
        yield session.get_one(Scenario, UUID(scenario_id))


def format_title(scenario_name: str) -> str:
    return f"Scenario - {scenario_name}"


def get_title(scenario_id: str) -> str:
    with get_scenario(scenario_id) as scenario:
        return format_title(str(scenario.name))


def match_path(path: str) -> str | None:
    match = re.match(SCENARIO_PATH_REGEX, path)
    if match:
        return match.group(1)
    return None


def header_data(scenario_id: str):
    with get_scenario(scenario_id) as scenario:
        scenario_name = str(scenario.name)
        return {
            "title": format_title(scenario_name),
            "breadcrumbs": [
                {"label": "Home", "href": "/"},
                {"label": "Scenarios", "href": "/scenarios"},
                {"label": scenario_name, "href": f"/scenarios/{scenario_id}"},
            ],
        }


dash.register_page(
    __name__,
    exclude_from_navbar=True,
    path_template="/scenarios/<scenario_id>",
    name="Scenario",
    title=get_title,
    match_path=match_path,
    header_data=header_data,
)

id_store_id = "scenario-id-store"
name_input_id = "scenario-name-input"
description_input_id = "scenario-description-input"
revert_button_id = "scenario-revert-button"
save_button_id = "scenario-save-button"


@callback(
    Output(revert_button_id, "disabled", allow_duplicate=True),
    Output(save_button_id, "disabled", allow_duplicate=True),
    Input(name_input_id, "value"),
    Input(description_input_id, "value"),
    config_prevent_initial_callbacks=True,
)
def on_change(_0, _1) -> Tuple[bool, bool]:
    return False, False


@callback(
    Output(revert_button_id, "disabled", allow_duplicate=True),
    Output(save_button_id, "disabled", allow_duplicate=True),
    Output(name_input_id, "value"),
    Output(description_input_id, "value"),
    Input(revert_button_id, "n_clicks"),
    State(id_store_id, "data"),
    config_prevent_initial_callbacks=True,
)
def revert(_n_clicks: int, scenario_id: str) -> Tuple[bool, bool, str, str]:
    with get_scenario(scenario_id) as scenario:
        return True, True, str(scenario.name), str(scenario.description)


@callback(
    Output(revert_button_id, "disabled", allow_duplicate=True),
    Output(save_button_id, "disabled", allow_duplicate=True),
    Input(save_button_id, "n_clicks"),
    State(id_store_id, "data"),
    State(name_input_id, "value"),
    State(description_input_id, "value"),
    config_prevent_initial_callbacks=True,
)
def save(
    _n_clicks: int, scenario_id: str, name: str, description: str
) -> Tuple[bool, bool]:
    with Session(get_db_engine()) as session:
        scenario = session.get_one(Scenario, UUID(scenario_id))
        scenario.name = name
        scenario.description = description
        session.commit()
        return True, True


def layout(scenario_id=None):
    if scenario_id is None:
        return (dmc.Text("No scenario"),)
    with get_scenario(scenario_id) as scenario:
        return dmc.Container(
            children=[
                dcc.Store(id=id_store_id, data=scenario_id),
                dmc.TextInput(
                    id=name_input_id,
                    label="Name",
                    placeholder="Name",
                    description="Scenario name",
                    value=str(scenario.name),
                    size="sm",
                    required=True,
                ),
                dmc.TextInput(
                    id=description_input_id,
                    label="Description",
                    placeholder="Description",
                    description="Scenario description",
                    value=str(scenario.description),
                    size="sm",
                ),
                dmc.Space(h=20),
                dmc.Group(
                    [
                        dmc.Button(
                            "Revert",
                            id=revert_button_id,
                            disabled=True,
                        ),
                        dmc.Button(
                            "Save",
                            id=save_button_id,
                            disabled=True,
                        ),
                    ],
                    justify="flex-end",
                ),
            ],
        )
