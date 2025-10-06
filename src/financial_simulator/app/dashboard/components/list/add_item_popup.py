import logging
from typing import Sequence, Tuple

import dash_mantine_components as dmc
from dash import Input, Output, State, callback

logger = logging.getLogger(__name__)


def create_add_item_popup(
    popup_id: str, label: str, types: Sequence[str] | None, action_store_id: str
) -> dmc.Modal:
    cancel_button_id = f"{popup_id}--cancel-button"
    submit_button_id = f"{popup_id}--submit-button"
    name_input_id = f"{popup_id}--name-input"
    type_select_id = f"{popup_id}--type-select"
    description_input_id = f"{popup_id}--description-input"

    @callback(
        Output(name_input_id, "value"),
        Output(type_select_id, "value"),
        Output(description_input_id, "value"),
        Input(action_store_id, "data"),
        State(name_input_id, "value"),
        State(type_select_id, "value"),
        State(description_input_id, "value"),
        config_prevent_initial_callbacks=True,
    )
    def init(add_action_data, name, type, description) -> Tuple[str, str | None, str]:
        if add_action_data["action"] == "init":
            return "", types[0] if types else None, ""
        return name, type, description

    @callback(
        Output(action_store_id, "data", allow_duplicate=True),
        Input(cancel_button_id, "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def cancel(_n_clicks: int):
        return {
            "action": "cancel",
        }

    @callback(
        Output(action_store_id, "data", allow_duplicate=True),
        Input(submit_button_id, "n_clicks"),
        State(name_input_id, "value"),
        State(type_select_id, "value"),
        State(description_input_id, "value"),
        config_prevent_initial_callbacks=True,
    )
    def submit(_n_clicks: int, name: str, type: str | None, description: str):
        return {
            "action": "submit",
            "data": {
                "name": name,
                "type": type,
                "description": description,
            },
        }

    return dmc.Modal(
        id=popup_id,
        title=dmc.Title(f"Add {label}", order=3),
        children=[
            dmc.TextInput(
                id=name_input_id,
                label="Name",
                placeholder=f"{label.capitalize()} name",
                description=f"Enter a name for the new {label}",
                size="sm",
                required=True,
            ),
            dmc.Select(
                id=type_select_id,
                label="Type",
                value=types[0] if types else None,
                data=[{"value": type, "label": type.capitalize()} for type in types]
                if types
                else [],
                display=None if types else "none",
            ),
            dmc.TextInput(
                id=description_input_id,
                label="Description",
                placeholder=f"{label.capitalize()} description",
                description=f"Enter a description for the new {label}",
                size="sm",
            ),
            dmc.Space(h=20),
            dmc.Group(
                [
                    dmc.Button(
                        "Submit",
                        id=submit_button_id,
                    ),
                    dmc.Button(
                        "Cancel",
                        color="red",
                        variant="outline",
                        id=cancel_button_id,
                    ),
                ],
                justify="flex-end",
            ),
        ],
    )
