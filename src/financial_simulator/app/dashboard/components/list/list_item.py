import logging

import dash_mantine_components as dmc
from dash_iconify import DashIconify

logger = logging.getLogger(__name__)


def create_list_item(list_href: str, item, delete_button_id) -> dmc.Card:
    return dmc.Card(
        children=[
            dmc.Anchor(
                href=f"{list_href}/{str(item.id)}",
                children=dmc.Text(str(item.name), fw="bold"),
            ),
            dmc.Text(str(item.type), size="sm") if hasattr(item, "type") else None,
            dmc.Text(str(item.description), size="sm", c="dimmed"),
            dmc.Space(h=10),
            dmc.Divider(),
            dmc.Space(h=10),
            dmc.Group(
                justify="flex-end",
                children=[
                    dmc.ActionIcon(
                        DashIconify(icon="zondicons:trash", width=100),
                        id=delete_button_id,
                        size="sm",
                        n_clicks=0,
                        variant="white",
                    ),
                ],
            ),
        ],
    )
