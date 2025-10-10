import logging
import uuid
from enum import StrEnum
from typing import Any, Dict, Sequence, Tuple

import dash_mantine_components as dmc
from dash import MATCH, Input, Output, State, callback, dcc
from pydantic import BaseModel

from financial_simulator.app.dashboard.aio.aio_id import aio_id_creator
from financial_simulator.app.dashboard.aio.list.list_item_type import (
    ListItemType,
)

logger = logging.getLogger(__name__)


class AddItemPopupActionType(StrEnum):
    INIT = "init"
    CANCEL = "cancel"
    SUBMIT = "submit"


class AddItemPopupActionData(BaseModel):
    name: str
    description: str
    type: str | None = None


class AddItemPopupAction(BaseModel):
    type: AddItemPopupActionType
    data: AddItemPopupActionData | None = None


def add_item_popup_aio_id_creator(sub_component: str):
    return aio_id_creator("AddItemPopupAIO", sub_component)


class AddItemPopup(dmc.Modal):
    class ids:
        popup = add_item_popup_aio_id_creator("popup")
        name_input = add_item_popup_aio_id_creator("name-input")
        type_select = add_item_popup_aio_id_creator("type-select")
        description_input = add_item_popup_aio_id_creator("description-input")
        submit_button = add_item_popup_aio_id_creator("submit-button")
        cancel_button = add_item_popup_aio_id_creator("cancel-button")
        types_store = add_item_popup_aio_id_creator("types-store")
        action_store = add_item_popup_aio_id_creator("action-store")

    ids = ids

    def __init__(
        self,
        label: str,
        types: Sequence[ListItemType] | None = None,
        aio_id: str | None = None,
    ):
        if aio_id is None:
            aio_id = str(uuid.uuid4())

        super().__init__(
            id=self.ids.popup(aio_id),
            title=dmc.Title(f"Add {label}", order=3),
            children=[
                dcc.Store(
                    id=self.ids.types_store(aio_id),
                    data=(
                        [item_type.model_dump() for item_type in types]
                        if types
                        else None
                    ),
                ),
                dcc.Store(id=self.ids.action_store(aio_id)),
                dmc.TextInput(
                    id=self.ids.name_input(aio_id),
                    label="Name",
                    placeholder=f"{label.capitalize()} name",
                    description=f"Enter a name for the new {label}",
                    size="sm",
                    required=True,
                ),
                dmc.Select(
                    id=self.ids.type_select(aio_id),
                    label="Type",
                    value=types[0].value if types else None,
                    data=(
                        [item_type.model_dump() for item_type in types]
                        if types
                        else None
                    ),
                    display=None if types else "none",
                ),
                dmc.TextInput(
                    id=self.ids.description_input(aio_id),
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
                            id=self.ids.submit_button(aio_id),
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
        Output(ids.name_input(MATCH), "value"),
        Output(ids.type_select(MATCH), "value"),
        Output(ids.description_input(MATCH), "value"),
        Input(ids.action_store(MATCH), "data"),
        State(ids.name_input(MATCH), "value"),
        State(ids.types_store(MATCH), "data"),
        State(ids.type_select(MATCH), "value"),
        State(ids.description_input(MATCH), "value"),
        config_prevent_initial_callbacks=True,
    )
    def init(
        add_action_raw: Dict[str, Any],
        name: str,
        types_raw: Sequence[Dict[str, Any]] | None,
        item_type: str | None,
        description: str,
    ) -> Tuple[str, str | None, str]:
        add_action = AddItemPopupAction.model_validate(add_action_raw)
        if add_action.type == AddItemPopupActionType.INIT:
            return (
                "",
                ListItemType.model_validate(types_raw[0]).value if types_raw else None,
                "",
            )
        return name, item_type, description

    @staticmethod
    @callback(
        Output(ids.action_store(MATCH), "data", allow_duplicate=True),
        Input(ids.cancel_button(MATCH), "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def cancel(_n_clicks: int) -> Dict[str, Any]:
        return AddItemPopupAction(
            type=AddItemPopupActionType.CANCEL,
        ).model_dump()

    @staticmethod
    @callback(
        Output(ids.action_store(MATCH), "data", allow_duplicate=True),
        Input(ids.submit_button(MATCH), "n_clicks"),
        State(ids.name_input(MATCH), "value"),
        State(ids.type_select(MATCH), "value"),
        State(ids.description_input(MATCH), "value"),
        config_prevent_initial_callbacks=True,
    )
    def submit(
        _n_clicks: int, name: str, item_type: str | None, description: str
    ) -> Dict[str, Any]:
        return AddItemPopupAction(
            type=AddItemPopupActionType.SUBMIT,
            data=AddItemPopupActionData(
                name=name,
                type=item_type,
                description=description,
            ),
        ).model_dump()
