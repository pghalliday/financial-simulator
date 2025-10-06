import logging

import dash_mantine_components as dmc
from dash import Input, Output, State, callback

logger = logging.getLogger(__name__)


def prompt_text_id(popup_id):
    return f"{popup_id}--prompt-text"


def cancel_button_id(popup_id):
    return f"{popup_id}--cancel-button"


def confirm_delete_item_popup_delete_button_id(popup_id):
    return f"{popup_id}--delete-button"


def create_confirm_delete_item_popup_callbacks(
    popup_id: str, label: str, action_store_id: str
):
    @callback(
        Output(prompt_text_id(popup_id), "children"),
        Input(action_store_id, "data"),
        State(prompt_text_id(popup_id), "value"),
        config_prevent_initial_callbacks=True,
    )
    def init(delete_action_data, prompt) -> str:
        if delete_action_data["action"] == "init":
            return f'Are you sure you want to delete {label}: "{delete_action_data["data"]["name"]}"?'
        return prompt

    @callback(
        Output(action_store_id, "data", allow_duplicate=True),
        Input(cancel_button_id(popup_id), "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def cancel(_n_clicks: int):
        return {
            "action": "cancel",
        }

    @callback(
        Output(action_store_id, "data", allow_duplicate=True),
        Input(confirm_delete_item_popup_delete_button_id(popup_id), "n_clicks"),
        State(action_store_id, "data"),
        config_prevent_initial_callbacks=True,
    )
    def delete(_n_clicks: int, delete_action_data):
        return {
            **delete_action_data,
            "action": "delete",
        }


def create_confirm_delete_item_popup(popup_id: str, label: str) -> dmc.Modal:
    return dmc.Modal(
        id=popup_id,
        title=dmc.Title(f"Confirm delete {label}", order=3),
        children=[
            dmc.Text(id=prompt_text_id(popup_id)),
            dmc.Space(h=20),
            dmc.Group(
                [
                    dmc.Button(
                        "Delete",
                        id=confirm_delete_item_popup_delete_button_id(popup_id),
                    ),
                    dmc.Button(
                        "Cancel",
                        color="red",
                        variant="outline",
                        id=cancel_button_id(popup_id),
                    ),
                ],
                justify="flex-end",
            ),
        ],
    )
