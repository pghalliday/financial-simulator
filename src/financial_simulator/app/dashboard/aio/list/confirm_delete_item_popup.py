import logging
import uuid
from enum import StrEnum
from typing import Any, Dict

import dash_mantine_components as dmc
from dash import MATCH, Input, Output, State, callback, dcc
from pydantic import BaseModel

from financial_simulator.app.dashboard.aio.aio_id import aio_id_creator
from financial_simulator.app.dashboard.aio.list.list_item import (
    ListItemToDeleteData,
)

logger = logging.getLogger(__name__)


class ConfirmDeleteItemPopupActionType(StrEnum):
    INIT = "init"
    CANCEL = "cancel"
    DELETE = "delete"


class ConfirmDeleteItemPopupAction(BaseModel):
    type: ConfirmDeleteItemPopupActionType
    data: ListItemToDeleteData | None = None


def confirm_delete_item_popup_aio_id_creator(sub_component: str):
    return aio_id_creator("ConfirmDeleteItemPopupAIO", sub_component)


class ConfirmDeleteItemPopup(dmc.Modal):
    class ids:
        popup = confirm_delete_item_popup_aio_id_creator("popup")
        prompt_text = confirm_delete_item_popup_aio_id_creator("prompt-text")
        delete_button = confirm_delete_item_popup_aio_id_creator("delete-button")
        cancel_button = confirm_delete_item_popup_aio_id_creator("cancel-button")
        label_store = confirm_delete_item_popup_aio_id_creator("label-store")
        action_store = confirm_delete_item_popup_aio_id_creator("action-store")

    ids = ids

    def __init__(
        self,
        label: str,
        aio_id: str | None = None,
    ):
        if aio_id is None:
            aio_id = str(uuid.uuid4())

        super().__init__(
            id=self.ids.popup(aio_id),
            title=dmc.Title(f"Confirm delete {label}", order=3),
            children=[
                dcc.Store(id=self.ids.label_store(aio_id), data=label),
                dcc.Store(id=self.ids.action_store(aio_id)),
                dmc.Text(id=self.ids.prompt_text(aio_id)),
                dmc.Space(h=20),
                dmc.Group(
                    [
                        dmc.Button(
                            "Delete",
                            id=self.ids.delete_button(aio_id),
                        ),
                        dmc.Button(
                            "Cancel",
                            color="red",
                            variant="outline",
                            id=self.ids.cancel_button(aio_id),
                        ),
                    ],
                    justify="flex-end",
                ),
            ],
        )

    @staticmethod
    @callback(
        Output(ids.prompt_text(MATCH), "children"),
        Input(ids.action_store(MATCH), "data"),
        State(ids.label_store(MATCH), "data"),
        State(ids.prompt_text(MATCH), "children"),
        config_prevent_initial_callbacks=True,
    )
    def init(delete_action_data_raw: Dict[str, Any], label: str, prompt: str) -> str:
        delete_action_data = ConfirmDeleteItemPopupAction.model_validate(
            delete_action_data_raw
        )
        if delete_action_data.type == ConfirmDeleteItemPopupActionType.INIT:
            return f'Are you sure you want to delete {label}: "{delete_action_data.data.name}"?'
        return prompt

    @staticmethod
    @callback(
        Output(ids.action_store(MATCH), "data", allow_duplicate=True),
        Input(ids.cancel_button(MATCH), "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def cancel(_n_clicks: int) -> Dict[str, Any]:
        return ConfirmDeleteItemPopupAction(
            type=ConfirmDeleteItemPopupActionType.CANCEL,
        ).model_dump()

    @staticmethod
    @callback(
        Output(ids.action_store(MATCH), "data", allow_duplicate=True),
        Input(ids.delete_button(MATCH), "n_clicks"),
        State(ids.action_store(MATCH), "data"),
        config_prevent_initial_callbacks=True,
    )
    def delete(_n_clicks: int, delete_action_raw: Dict[str, Any]) -> Dict[str, Any]:
        delete_action = ConfirmDeleteItemPopupAction.model_validate(delete_action_raw)
        return ConfirmDeleteItemPopupAction(
            type=ConfirmDeleteItemPopupActionType.DELETE,
            data=delete_action.data,
        ).model_dump()
