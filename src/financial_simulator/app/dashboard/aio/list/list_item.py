import logging
import uuid
from typing import Any, Dict

import dash_mantine_components as dmc
from dash import MATCH, Input, Output, State, callback, ctx, dcc, html, set_props
from dash_iconify import DashIconify
from pydantic import BaseModel

from financial_simulator.app.dashboard.aio.aio_id import aio_id_creator
from financial_simulator.app.dashboard.aio.list.list_item_type import (
    ListItemType,
)

logger = logging.getLogger(__name__)


class ListItemData(BaseModel):
    name: str
    to_delete_store_id: Any

class ListItemToDeleteData(BaseModel):
    id: str
    name: str

def list_item_aio_id_creator(sub_component: str):
    return aio_id_creator("ListItemAIO", sub_component)


class ListItem(dmc.TableTr):
    class ids:
        list_item = list_item_aio_id_creator("list-item")
        delete_button = list_item_aio_id_creator("delete-button")
        item_data_store = list_item_aio_id_creator("item-data-store")
        dummy_output = list_item_aio_id_creator("dummy-output")

    ids = ids

    def __init__(
        self,
        name: str,
        description: str,
        href: str,
        to_delete_store_id: Any,
        item_type: ListItemType | None = None,
        aio_id: str | None = None,
    ):
        if aio_id is None:
            aio_id = str(uuid.uuid4())

        super().__init__(
            id=self.ids.list_item(aio_id),
            children=[
                dmc.TableTd(
                    dmc.Anchor(
                        href=href,
                        children=dmc.Text(name, fw="bold"),
                    ),
                ),
                dmc.TableTd(item_type.label) if item_type else None,
                dmc.TableTd(description),
                dmc.TableTd(
                    [
                        html.Div(id=self.ids.dummy_output(aio_id)),
                        dcc.Store(
                            id=self.ids.item_data_store(aio_id),
                            data=ListItemData(
                                name=name,
                                to_delete_store_id=to_delete_store_id,
                            ).model_dump(),
                        ),
                        dmc.Group(
                            justify="flex-end",
                            children=[
                                dmc.ActionIcon(
                                    DashIconify(icon="zondicons:trash", width=100),
                                    id=self.ids.delete_button(aio_id),
                                    size="sm",
                                    n_clicks=0,
                                    variant="transparent",
                                ),
                            ],
                        ),
                    ],
                ),
            ],
        )

    @staticmethod
    @callback(
        Output(ids.dummy_output(MATCH), "children"),
        Input(ids.delete_button(MATCH), "n_clicks"),
        State(ids.item_data_store(MATCH), "data"),
        config_prevent_initial_callbacks=True,
    )
    def click_delete(_n_clicks: int, item_data_raw: Dict[str, Any]) -> None:
        item_data = ListItemData.model_validate(item_data_raw)
        set_props(
            item_data.to_delete_store_id,
            {
                "data": ListItemToDeleteData(
                    id=ctx.triggered_id["aio_id"],
                    name=item_data.name,
                ).model_dump(),
            },
        )
