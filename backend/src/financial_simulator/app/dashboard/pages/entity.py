import re
from contextlib import contextmanager
from typing import Tuple
from uuid import UUID

import dash
import dash_mantine_components as dmc
from dash import Input, Output, State, callback, dcc
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.constants import (
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    ENTITIES_HREF,
    ENTITIES_NAME,
    ENTITY_HREF_REGEX,
    ENTITY_HREF_TEMPLATE,
    ENTITY_NAME,
    get_entity_href,
)
from financial_simulator.app.dashboard.globals import get_db_engine
from financial_simulator.app.database.schema import Entity


@contextmanager
def get_entity(entity_id: str):
    with Session(get_db_engine()) as session:
        yield session.get_one(Entity, UUID(entity_id))


def get_name(entity_id: str) -> str:
    with get_entity(entity_id) as entity:
        return str(entity.name)


def format_title(entity_name: str) -> str:
    return f"{ENTITY_NAME} - {entity_name}"


def get_title(entity_id: str) -> str:
    return format_title(get_name(entity_id))


def match_path(path: str) -> str | None:
    match = re.match(ENTITY_HREF_REGEX, path)
    if match:
        return match.group(1)
    return None


def header_data(entity_id: str):
    entity_name = get_name(entity_id)
    return {
        "title": format_title(entity_name),
        "breadcrumbs": [
            {"label": COMPARE_SCENARIOS_NAME, "href": COMPARE_SCENARIOS_HREF},
            {"label": ENTITIES_NAME, "href": ENTITIES_HREF},
            {"label": entity_name, "href": get_entity_href(entity_id)},
        ],
    }


dash.register_page(
    __name__,
    exclude_from_navbar=True,
    path_template=ENTITY_HREF_TEMPLATE,
    name=ENTITY_NAME,
    title=get_title,
    match_path=match_path,
    header_data=header_data,
)

id_store_id = "entity-id-store"
name_input_id = "entity-name-input"
description_input_id = "entity-description-input"
revert_button_id = "entity-revert-button"
save_button_id = "entity-save-button"


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
def revert(_n_clicks: int, entity_id: str) -> Tuple[bool, bool, str, str]:
    with get_entity(entity_id) as entity:
        return True, True, str(entity.name), str(entity.description)


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
    _n_clicks: int, entity_id: str, name: str, description: str
) -> Tuple[bool, bool]:
    with Session(get_db_engine()) as session:
        entity = session.get_one(Entity, UUID(entity_id))
        entity.name = name
        entity.description = description
        session.commit()
        return True, True


def layout(entity_id=None):
    if entity_id is None:
        return (dmc.Text("No entity"),)
    with get_entity(entity_id) as entity:
        return dmc.Container(
            children=[
                dcc.Store(id=id_store_id, data=entity_id),
                dmc.TextInput(
                    id=name_input_id,
                    label="Name",
                    placeholder="Name",
                    description="Entity name",
                    value=str(entity.name),
                    size="sm",
                    required=True,
                ),
                dmc.TextInput(
                    id=description_input_id,
                    label="Description",
                    placeholder="Description",
                    description="Entity description",
                    value=str(entity.description),
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
