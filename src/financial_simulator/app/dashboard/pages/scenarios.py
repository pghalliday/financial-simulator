import logging
from typing import Mapping, Sequence, Tuple
from uuid import UUID

import dash
import dash_mantine_components as dmc
from dash import ALL, MATCH, Input, Output, Patch, State, callback, ctx, dcc
from dash_iconify import DashIconify
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.globals import get_engine
from financial_simulator.app.database.schema import Scenario

logger = logging.getLogger(__name__)

SCENARIO_LOCATION = "scenario-location"

SCENARIO_GRID = "scenario-grid"
SCENARIO_ADD = "scenario-add"
SCENARIO_CARD = lambda scenario_id: {"type": "scenario-card", "id": scenario_id}
SCENARIO_EDIT = lambda scenario_id: {"type": "scenario-edit", "id": scenario_id}
SCENARIO_DELETE = lambda scenario_id: {"type": "scenario-delete", "id": scenario_id}
SCENARIO_CONFIRM_DELETE = lambda scenario_id: {
    "type": "scenario-confirm-delete",
    "id": scenario_id,
}
SCENARIO_CONFIRM_DELETE_YES = lambda scenario_id: {
    "type": "scenario-confirm-delete-yes",
    "id": scenario_id,
}
SCENARIO_CONFIRM_DELETE_NO = lambda scenario_id: {
    "type": "scenario-confirm-delete-no",
    "id": scenario_id,
}
SCENARIO_DELETED = lambda scenario_id: {"type": "scenario-deleted", "id": scenario_id}
SCENARIO_ADD_POPUP = "scenario-add-popup"
SCENARIO_ADD_NAME = "scenario-add-name"
SCENARIO_ADD_DESCRIPTION = "scenario-add-description"
SCENARIO_ADD_SUBMIT = "scenario-add-submit"
SCENARIO_ADD_CANCEL = "scenario-add-cancel"

dash.register_page(__name__, order=1)

layout = dmc.Container(
    [
        dcc.Location(id=SCENARIO_LOCATION),
        dmc.SimpleGrid(
            id=SCENARIO_GRID,
            cols={"base": 1, "sm": 2, "lg": 5},
            spacing={"base": 10, "sm": "xl"},
            verticalSpacing={"base": "md", "sm": "xl"},
        ),
        dmc.Affix(
            dmc.ActionIcon(
                DashIconify(icon="zondicons:add-solid", width=100),
                id=SCENARIO_ADD,
                size="xl",
                n_clicks=0,
                variant="white",
            ),
            position={
                "bottom": 50,
                "right": 50,
            },
        ),
        dmc.Modal(
            id=SCENARIO_ADD_POPUP,
            title=dmc.Title("Add scenario", order=3),
            children=[
                dmc.TextInput(
                    id=SCENARIO_ADD_NAME,
                    label="Name",
                    placeholder="Scenario name",
                    description="Enter a name for the new scenario",
                    size="sm",
                    required=True,
                ),
                dmc.TextInput(
                    id=SCENARIO_ADD_DESCRIPTION,
                    label="Description",
                    placeholder="Scenario description",
                    description="Enter a description for the new scenario",
                    size="sm",
                ),
                dmc.Space(h=20),
                dmc.Group(
                    [
                        dmc.Button("Submit", id=SCENARIO_ADD_SUBMIT),
                        dmc.Button(
                            "Cancel",
                            color="red",
                            variant="outline",
                            id=SCENARIO_ADD_CANCEL,
                        ),
                    ],
                    justify="flex-end",
                ),
            ],
        ),
    ]
)


def create_scenario_card(scenario: Scenario) -> dmc.Card:
    return dmc.Card(
        id=SCENARIO_CARD(str(scenario.id)),
        children=[
            dcc.Store(
                id=SCENARIO_DELETED(str(scenario.id)),
                data=False,
            ),
            dmc.Modal(
                id=SCENARIO_CONFIRM_DELETE(str(scenario.id)),
                title=dmc.Title("Confirm delete", order=3),
                children=[
                    dmc.Text(
                        f'Are you sure you want to delete scenario: "{scenario.name}"?'
                    ),
                    dmc.Space(h=20),
                    dmc.Group(
                        [
                            dmc.Button(
                                "Delete",
                                id=SCENARIO_CONFIRM_DELETE_YES(str(scenario.id)),
                            ),
                            dmc.Button(
                                "Cancel",
                                color="red",
                                variant="outline",
                                id=SCENARIO_CONFIRM_DELETE_NO(str(scenario.id)),
                            ),
                        ],
                        justify="flex-end",
                    ),
                ],
            ),
            dmc.Anchor(
                href=f"/scenarios/{str(scenario.id)}",
                children=dmc.Text(str(scenario.name), fw="bold"),
            ),
            dmc.Text(str(scenario.description), size="sm", c="dimmed"),
            dmc.Space(h=10),
            dmc.Divider(),
            dmc.Space(h=10),
            dmc.Group(
                justify="flex-end",
                children=[
                    dmc.ActionIcon(
                        DashIconify(icon="zondicons:trash", width=100),
                        id=SCENARIO_DELETE(str(scenario.id)),
                        size="sm",
                        n_clicks=0,
                        variant="white",
                    ),
                ],
            ),
        ],
    )


@callback(
    Output(SCENARIO_GRID, "children", allow_duplicate=True),
    Input(SCENARIO_GRID, "children"),
    config_prevent_initial_callbacks="initial_duplicate",
)
def load_initial_scenarios(values) -> Patch | Sequence[dmc.Card]:
    with Session(get_engine()) as session:
        scenarios = session.query(Scenario).all()
        return [create_scenario_card(scenario) for scenario in scenarios]


@callback(
    Output(SCENARIO_GRID, "children", allow_duplicate=True),
    Input(SCENARIO_DELETED(ALL), "data"),
    config_prevent_initial_callbacks=True,
)
def remove_deleted_scenarios(deleted_flags) -> Patch:
    patched_cards = Patch()
    cards_to_remove = []
    for i, value in enumerate(deleted_flags):
        if value:
            cards_to_remove.insert(0, i)
    for c in cards_to_remove:
        del patched_cards[c]
    return patched_cards


@callback(
    Output(SCENARIO_CONFIRM_DELETE(MATCH), "opened", allow_duplicate=True),
    Input(SCENARIO_DELETE(MATCH), "n_clicks"),
    config_prevent_initial_callbacks=True,
)
def delete_scenario(
    _n_clicks: int,
) -> bool:
    return True


@callback(
    Output(SCENARIO_CONFIRM_DELETE(MATCH), "opened", allow_duplicate=True),
    Input(SCENARIO_CONFIRM_DELETE_NO(MATCH), "n_clicks"),
    config_prevent_initial_callbacks=True,
)
def cancel_delete_scenario(
    _n_clicks: int,
) -> bool:
    return False


@callback(
    Output(SCENARIO_DELETED(MATCH), "data"),
    Output(SCENARIO_CONFIRM_DELETE(MATCH), "opened", allow_duplicate=True),
    Input(SCENARIO_CONFIRM_DELETE_YES(MATCH), "n_clicks"),
    State(SCENARIO_CONFIRM_DELETE_YES(MATCH), "id"),
    config_prevent_initial_callbacks=True,
)
def confirm_delete_scenario(
    _n_clicks: int,
    confirm_button_id: Mapping[str, str],
) -> Tuple[bool, bool]:
    with Session(get_engine()) as session:
        scenario = session.get(Scenario, UUID(confirm_button_id["id"]))
        if scenario is not None:
            session.delete(scenario)
            session.commit()
    return True, False


@callback(
    Output(SCENARIO_ADD_POPUP, "opened", allow_duplicate=True),
    Input(SCENARIO_ADD, "n_clicks"),
    config_prevent_initial_callbacks=True,
)
def add_scenario(_n_clicks: int) -> bool:
    return True


@callback(
    Output(SCENARIO_ADD_POPUP, "opened", allow_duplicate=True),
    Input(SCENARIO_ADD_CANCEL, "n_clicks"),
    config_prevent_initial_callbacks=True,
)
def cancel_add_scenario(_n_clicks: int) -> bool:
    return False


@callback(
    Output(SCENARIO_GRID, "children", allow_duplicate=True),
    Output(SCENARIO_ADD_POPUP, "opened", allow_duplicate=True),
    Input(SCENARIO_ADD_SUBMIT, "n_clicks"),
    Input(SCENARIO_ADD_NAME, "value"),
    Input(SCENARIO_ADD_DESCRIPTION, "value"),
    config_prevent_initial_callbacks=True,
)
def submit_add_scenario(_n_clicks: int, name: str, description: str) -> Tuple[Patch, bool]:
    patched_cards = Patch()
    if ctx.triggered_id == SCENARIO_ADD_SUBMIT:
        with Session(get_engine()) as session:
            scenario = Scenario(name=name, description=description)
            session.add(scenario)
            session.commit()
            patched_cards.append(create_scenario_card(scenario))
        return patched_cards, False
    return patched_cards, True
