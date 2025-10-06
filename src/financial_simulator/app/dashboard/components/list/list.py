import logging
from typing import Any, Sequence, Tuple
from urllib.parse import urljoin
from uuid import UUID

import dash_mantine_components as dmc
from dash import ALL, Input, Output, Patch, State, callback, ctx, dcc
from dash_iconify import DashIconify

from financial_simulator.app.dashboard.components.list.add_item_popup import (
    create_add_item_popup,
)
from financial_simulator.app.dashboard.components.list.confirm_delete_item_popup import (
    create_confirm_delete_item_popup,
)
from financial_simulator.app.dashboard.components.list.list_item import create_list_item

logger = logging.getLogger(__name__)


def create_list(
    list_id: str,
    list_href: str,
    label: str,
    types: Sequence[str],
    location_id: str,
    get_items_context,
    add_item_context,
    delete_item_context,
) -> dmc.Box:
    add_button_id = f"{list_id}--add-button"
    add_action_store_id = f"{list_id}--add-action-store"
    add_item_popup_id = f"{list_id}--add-item-popup"
    delete_action_store_id = f"{list_id}--delete-action-store"
    confirm_delete_item_popup_id = f"{list_id}--confirm-delete-item-popup"

    def create_delete_button_id(item_id: str) -> Any:
        return {"type": f"{list_id}--delete-button", "id": item_id}

    def create_item_data_store_id(item_id: str) -> Any:
        return {"type": f"{list_id}--item-data-store", "id": item_id}

    @callback(
        Output(list_id, "children", allow_duplicate=True),
        Input(list_id, "children"),
        config_prevent_initial_callbacks="initial_duplicate",
    )
    def load_initial_items(_list_items) -> Sequence[dmc.Box]:
        with get_items_context() as items:
            return [
                dmc.Box(
                    [
                        dcc.Store(
                            id=create_item_data_store_id(str(item.id)),
                            data={
                                "id": str(item.id),
                                "name": item.name,
                            },
                        ),
                        create_list_item(
                            list_href,
                            item,
                            create_delete_button_id(str(item.id)),
                        ),
                    ]
                )
                for item in items
            ]

    @callback(
        Output(list_id, "children", allow_duplicate=True),
        Output(add_item_popup_id, "opened"),
        Output(location_id, "href", allow_duplicate=True),
        Input(add_action_store_id, "data"),
        State(location_id, "href"),
        config_prevent_initial_callbacks=True,
    )
    def add_item(add_action_data: Any, location: str) -> Tuple[Patch, bool, str]:
        patch = Patch()
        if add_action_data:
            if add_action_data["action"] == "submit":
                with add_item_context(add_action_data["data"]) as item:
                    patch.append(
                        dmc.Box(
                            [
                                dcc.Store(
                                    id=create_item_data_store_id(str(item.id)),
                                    data={
                                        "id": str(item.id),
                                        "name": item.name,
                                    },
                                ),
                                create_list_item(
                                    list_href,
                                    item,
                                    create_delete_button_id(str(item.id)),
                                ),
                            ]
                        )
                    )
                return patch, False, urljoin(list_href, str(item.id))
            elif add_action_data["action"] == "cancel":
                return patch, False, location
            # the other action is "init", which should
            # trigger displaying the popup
            return patch, True, location
        return patch, False, location

    @callback(
        Output(add_action_store_id, "data", allow_duplicate=True),
        Input(add_button_id, "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def click_add_button(_n_clicks: int):
        return {
            "action": "init",
        }

    @callback(
        Output(list_id, "children", allow_duplicate=True),
        Output(confirm_delete_item_popup_id, "opened"),
        Input(delete_action_store_id, "data"),
        config_prevent_initial_callbacks=True,
    )
    def delete_item(delete_action_data: Any) -> Tuple[Patch, bool]:
        patch = Patch()
        if delete_action_data["action"] == "delete":
            with delete_item_context(UUID(delete_action_data["data"]["id"])) as _item:
                del patch[delete_action_data["idx"]]
            return patch, False
        if delete_action_data["action"] == "cancel":
            return patch, False
        if delete_action_data["action"] == "init":
            return patch, True
        # the other action is "none", which should do nothing
        return patch, False

    @callback(
        Output(delete_action_store_id, "data", allow_duplicate=True),
        Input(create_delete_button_id(ALL), "n_clicks"),
        State(create_item_data_store_id(ALL), "data"),
        config_prevent_initial_callbacks=True,
    )
    def click_delete_button(all_n_clicks, all_item_data):
        if ctx.triggered_id is not None:
            item_id = ctx.triggered_id["id"]
            idx, item_data = next(
                (idx, item_data)
                for idx, item_data in enumerate(all_item_data)
                if item_id == item_data["id"]
            )
            if all_n_clicks[idx] > 0:
                return {
                    "action": "init",
                    "idx": idx,
                    "data": item_data,
                }
        return {
            "action": "none",
        }

    return dmc.Box(
        [
            dcc.Store(id=add_action_store_id),
            create_add_item_popup(add_item_popup_id, label, types, add_action_store_id),
            dcc.Store(id=delete_action_store_id),
            create_confirm_delete_item_popup(
                confirm_delete_item_popup_id, label, delete_action_store_id
            ),
            dmc.SimpleGrid(
                id=list_id,
                cols={"base": 1, "sm": 2, "lg": 5},
                spacing={"base": 10, "sm": "xl"},
                verticalSpacing={"base": "md", "sm": "xl"},
            ),
            dmc.Affix(
                dmc.ActionIcon(
                    DashIconify(icon="zondicons:add-solid", width=100),
                    id=add_button_id,
                    size="xl",
                    n_clicks=0,
                    variant="white",
                ),
                position={
                    "bottom": 50,
                    "right": 50,
                },
            ),
        ]
    )
