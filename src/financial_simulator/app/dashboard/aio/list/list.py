import logging
import uuid
from enum import StrEnum
from typing import Any, Dict, Sequence

import dash_mantine_components as dmc
from dash import MATCH, Input, Output, Patch, State, callback, ctx, dcc, html, set_props
from dash_iconify import DashIconify
from pydantic import BaseModel

from financial_simulator.app.dashboard.aio.aio_id import aio_id_creator
from financial_simulator.app.dashboard.aio.list.add_item_popup import (
    AddItemPopup,
    AddItemPopupAction,
    AddItemPopupActionData,
    AddItemPopupActionType,
)
from financial_simulator.app.dashboard.aio.list.confirm_delete_item_popup import (
    ConfirmDeleteItemPopup,
    ConfirmDeleteItemPopupAction,
    ConfirmDeleteItemPopupActionType,
)
from financial_simulator.app.dashboard.aio.list.list_item import (
    ListItem,
    ListItemToDeleteData,
)
from financial_simulator.app.dashboard.aio.list.list_item_type import (
    ListItemType,
)

logger = logging.getLogger(__name__)


class ListItemData(BaseModel):
    id: str
    href: str
    name: str
    description: str
    type: ListItemType | None = None


class ListAddActionType(StrEnum):
    ADD = "add"
    COMPLETE = "complete"


class ListAddAction(BaseModel):
    type: ListAddActionType
    add_data: AddItemPopupActionData | None = None
    complete_data: ListItemData | None = None


class ListDeleteActionType(StrEnum):
    DELETE = "delete"
    COMPLETE = "complete"


class ListDeleteAction(BaseModel):
    type: ListDeleteActionType
    id: str


def list_aio_id_creator(sub_component: str):
    return aio_id_creator("ListAIO", sub_component)


class List(dmc.Box):
    class ids:
        list = list_aio_id_creator("list")
        add_button = list_aio_id_creator("add-button")
        add_action_store = list_aio_id_creator("add-action-store")
        delete_action_store = list_aio_id_creator("delete-action-store")
        to_delete_store = list_aio_id_creator("to-delete-store")
        dummy_output = list_aio_id_creator("dummy-output")

    ids = ids

    def __init__(
        self,
        label: str,
        items: Sequence[ListItemData],
        types: Sequence[ListItemType] | None = None,
        aio_id: str | None = None,
    ):
        if aio_id is None:
            aio_id = str(uuid.uuid4())

        list_items = [
            ListItem(
                aio_id=item.id,
                to_delete_store_id=self.ids.to_delete_store(aio_id),
                name=item.name,
                description=item.description,
                href=item.href,
                item_type=item.type,
            )
            for item in items
        ]

        super().__init__(
            [
                html.Div(id=self.ids.dummy_output(aio_id)),
                dcc.Store(id=self.ids.add_action_store(aio_id)),
                dcc.Store(id=self.ids.delete_action_store(aio_id)),
                dcc.Store(id=self.ids.to_delete_store(aio_id)),
                AddItemPopup(aio_id=aio_id, label=label, types=types),
                ConfirmDeleteItemPopup(aio_id=aio_id, label=label),
                dmc.Table(
                    striped="odd",
                    highlightOnHover=True,
                    withTableBorder=True,
                    stickyHeader=True,
                    children=[
                        dmc.TableThead(
                            dmc.TableTr(
                                [
                                    dmc.TableTh("Name"),
                                    dmc.TableTh("Type") if types else None,
                                    dmc.TableTh("Description"),
                                    dmc.TableTh(
                                        dmc.Group(
                                            justify="flex-end",
                                            children=[
                                                dmc.ActionIcon(
                                                    DashIconify(
                                                        icon="zondicons:add-solid",
                                                        width=100,
                                                    ),
                                                    id=self.ids.add_button(aio_id),
                                                    size="sm",
                                                    n_clicks=0,
                                                    variant="transparent",
                                                ),
                                            ],
                                        ),
                                    ),
                                ]
                            ),
                        ),
                        dmc.TableTbody(
                            id=self.ids.list(aio_id),
                            children=list_items,
                        ),
                    ],
                ),
            ]
        )

    @staticmethod
    @callback(
        Output(ids.list(MATCH), "children", allow_duplicate=True),
        Input(ids.add_action_store(MATCH), "data"),
        config_prevent_initial_callbacks=True,
    )
    def complete_add(add_action_raw: Dict[str, Any]) -> Patch:
        patch = Patch()
        add_action = ListAddAction.model_validate(add_action_raw)
        aio_id = ctx.triggered_id["aio_id"]
        popup_id = AddItemPopup.ids.popup(aio_id)
        if add_action.type == ListAddActionType.COMPLETE:
            patch.append(
                ListItem(
                    aio_id=add_action.complete_data.id,
                    name=add_action.complete_data.name,
                    description=add_action.complete_data.description,
                    item_type=add_action.complete_data.type,
                    to_delete_store_id=List.ids.to_delete_store(aio_id),
                    href=add_action.complete_data.href,
                )
            )
            set_props(popup_id, {"opened": False})
        return patch

    @staticmethod
    @callback(
        Output(ids.dummy_output(MATCH), "children", allow_duplicate=True),
        Input(AddItemPopup.ids.action_store(MATCH), "data"),
        config_prevent_initial_callbacks=True,
    )
    def do_add(add_action_raw: Dict[str, Any]) -> None:
        add_action = AddItemPopupAction.model_validate(add_action_raw)
        popup_id = AddItemPopup.ids.popup(ctx.triggered_id["aio_id"])
        if add_action.type == AddItemPopupActionType.INIT:
            set_props(popup_id, {"opened": True})
        if add_action.type == AddItemPopupActionType.CANCEL:
            set_props(popup_id, {"opened": False})
        if add_action.type == AddItemPopupActionType.SUBMIT:
            set_props(
                List.ids.add_action_store(ctx.triggered_id["aio_id"]),
                {
                    "data": ListAddAction(
                        type=ListAddActionType.ADD,
                        add_data=add_action.data,
                    ).model_dump(),
                },
            )

    @staticmethod
    @callback(
        Output(AddItemPopup.ids.action_store(MATCH), "data", allow_duplicate=True),
        Input(ids.add_button(MATCH), "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def click_add_button(_n_clicks: int) -> Dict[str, Any]:
        return AddItemPopupAction(
            type=AddItemPopupActionType.INIT,
        ).model_dump()

    @staticmethod
    @callback(
        Output(ids.list(MATCH), "children", allow_duplicate=True),
        Input(ids.delete_action_store(MATCH), "data"),
        State(ids.list(MATCH), "children"),
        config_prevent_initial_callbacks=True,
    )
    def complete_delete(
        delete_action_raw: Dict[str, Any], items: Sequence[ListItem]
    ) -> Patch:
        patch = Patch()
        delete_action = ListDeleteAction.model_validate(delete_action_raw)
        aio_id = ctx.triggered_id["aio_id"]
        popup_id = ConfirmDeleteItemPopup.ids.popup(aio_id)
        if delete_action.type == ListDeleteActionType.COMPLETE:
            idx = next(
                idx
                for idx, item in enumerate(items)
                if item["props"]["id"] == ListItem.ids.list_item(delete_action.id)
            )
            del patch[idx]
            set_props(popup_id, {"opened": False})
        return patch

    @staticmethod
    @callback(
        Output(ids.dummy_output(MATCH), "children", allow_duplicate=True),
        Input(ConfirmDeleteItemPopup.ids.action_store(MATCH), "data"),
        config_prevent_initial_callbacks=True,
    )
    def do_delete(delete_action_raw: Dict[str, Any]) -> None:
        delete_action = ConfirmDeleteItemPopupAction.model_validate(delete_action_raw)
        popup_id = ConfirmDeleteItemPopup.ids.popup(ctx.triggered_id["aio_id"])
        if delete_action.type == ConfirmDeleteItemPopupActionType.INIT:
            set_props(popup_id, {"opened": True})
        if delete_action.type == ConfirmDeleteItemPopupActionType.CANCEL:
            set_props(popup_id, {"opened": False})
        if delete_action.type == ConfirmDeleteItemPopupActionType.DELETE:
            set_props(
                List.ids.delete_action_store(ctx.triggered_id["aio_id"]),
                {
                    "data": ListDeleteAction(
                        type=ListDeleteActionType.DELETE,
                        id=delete_action.data.id,
                    ).model_dump(),
                },
            )

    @staticmethod
    @callback(
        Output(
            ConfirmDeleteItemPopup.ids.action_store(MATCH), "data", allow_duplicate=True
        ),
        Input(ids.to_delete_store(MATCH), "data"),
        config_prevent_initial_callbacks=True,
    )
    def click_delete_button(to_delete_data_raw: Dict[str, Any]) -> Dict[str, Any]:
        return ConfirmDeleteItemPopupAction(
            type=ConfirmDeleteItemPopupActionType.INIT,
            data=ListItemToDeleteData.model_validate(to_delete_data_raw),
        ).model_dump()
