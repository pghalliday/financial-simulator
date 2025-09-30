import logging
from typing import Any, Mapping, Sequence, Tuple
from uuid import UUID

import dash_mantine_components as dmc
from dash import ALL, MATCH, Input, Output, Patch, State, callback, ctx, dcc
from dash_iconify import DashIconify

logger = logging.getLogger(__name__)


def create_list_page(
    name: str,
    label: str,
    get_items_context,
    add_item_context,
    delete_item_context,
):
    LIST_GRID = f"{name}-grid"
    LIST_ADD = f"{name}-add"
    LIST_CARD = lambda item_id: {"type": f"{name}-card", "id": item_id}
    LIST_DELETE = lambda item_id: {"type": f"{name}-delete", "id": item_id}
    LIST_CONFIRM_DELETE = lambda item_id: {
        "type": f"{name}-confirm-delete",
        "id": item_id,
    }
    LIST_CONFIRM_DELETE_YES = lambda item_id: {
        "type": f"{name}-confirm-delete-yes",
        "id": item_id,
    }
    LIST_CONFIRM_DELETE_NO = lambda item_id: {
        "type": f"{name}-confirm-delete-no",
        "id": item_id,
    }
    LIST_DELETED = lambda item_id: {"type": f"{name}-deleted", "id": item_id}
    LIST_ADD_POPUP = f"{name}-add-popup"
    LIST_ADD_NAME = f"{name}-add-name"
    LIST_ADD_DESCRIPTION = f"{name}-add-description"
    LIST_ADD_SUBMIT = f"{name}-add-submit"
    LIST_ADD_CANCEL = f"{name}-add-cancel"

    @callback(
        Output(LIST_GRID, "children", allow_duplicate=True),
        Input(LIST_GRID, "children"),
        config_prevent_initial_callbacks="initial_duplicate",
    )
    def load_initial_items(_cards) -> Patch | Sequence[dmc.Card]:
        with get_items_context() as items:
            return [create_card(item) for item in items]

    @callback(
        Output(LIST_GRID, "children", allow_duplicate=True),
        Input(LIST_DELETED(ALL), "data"),
        config_prevent_initial_callbacks=True,
    )
    def remove_deleted_items(deleted_flags) -> Patch:
        patched_cards = Patch()
        cards_to_remove = []
        for i, value in enumerate(deleted_flags):
            if value:
                cards_to_remove.insert(0, i)
        for c in cards_to_remove:
            del patched_cards[c]
        return patched_cards

    @callback(
        Output(LIST_CONFIRM_DELETE(MATCH), "opened", allow_duplicate=True),
        Input(LIST_DELETE(MATCH), "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def delete_item(
        _n_clicks: int,
    ) -> bool:
        return True

    @callback(
        Output(LIST_CONFIRM_DELETE(MATCH), "opened", allow_duplicate=True),
        Input(LIST_CONFIRM_DELETE_NO(MATCH), "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def cancel_delete_item(
        _n_clicks: int,
    ) -> bool:
        return False

    @callback(
        Output(LIST_DELETED(MATCH), "data"),
        Output(LIST_CONFIRM_DELETE(MATCH), "opened", allow_duplicate=True),
        Input(LIST_CONFIRM_DELETE_YES(MATCH), "n_clicks"),
        State(LIST_CONFIRM_DELETE_YES(MATCH), "id"),
        config_prevent_initial_callbacks=True,
    )
    def confirm_delete_item(
        _n_clicks: int,
        confirm_button_id: Mapping[str, str],
    ) -> Tuple[bool, bool]:
        with delete_item_context(UUID(confirm_button_id["id"])) as _item:
            return True, False

    @callback(
        Output(LIST_ADD_NAME, "value"),
        Output(LIST_ADD_DESCRIPTION, "value"),
        Output(LIST_ADD_POPUP, "opened", allow_duplicate=True),
        Input(LIST_ADD, "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def add_item(_n_clicks: int) -> Tuple[str, str, bool]:
        return "", "", True

    @callback(
        Output(LIST_ADD_POPUP, "opened", allow_duplicate=True),
        Input(LIST_ADD_CANCEL, "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def cancel_add_item(_n_clicks: int) -> bool:
        return False

    @callback(
        Output(LIST_GRID, "children", allow_duplicate=True),
        Output(LIST_ADD_POPUP, "opened", allow_duplicate=True),
        Input(LIST_ADD_SUBMIT, "n_clicks"),
        Input(LIST_ADD_NAME, "value"),
        Input(LIST_ADD_DESCRIPTION, "value"),
        config_prevent_initial_callbacks=True,
    )
    def submit_add_item(
        _n_clicks: int, name: str, description: str
    ) -> Tuple[Patch, bool]:
        patched_cards = Patch()
        if ctx.triggered_id == LIST_ADD_SUBMIT:
            with add_item_context(name, description) as item:
                patched_cards.append(create_card(item))
            return patched_cards, False
        return patched_cards, True

    def create_card(item: Any) -> dmc.Card:
        return dmc.Card(
            id=LIST_CARD(str(item.id)),
            children=[
                dcc.Store(
                    id=LIST_DELETED(str(item.id)),
                    data=False,
                ),
                dmc.Modal(
                    id=LIST_CONFIRM_DELETE(str(item.id)),
                    title=dmc.Title(f"Confirm delete {label}", order=3),
                    children=[
                        dmc.Text(
                            f'Are you sure you want to delete {label}: "{item.name}"?'
                        ),
                        dmc.Space(h=20),
                        dmc.Group(
                            [
                                dmc.Button(
                                    "Delete",
                                    id=LIST_CONFIRM_DELETE_YES(str(item.id)),
                                ),
                                dmc.Button(
                                    "Cancel",
                                    color="red",
                                    variant="outline",
                                    id=LIST_CONFIRM_DELETE_NO(str(item.id)),
                                ),
                            ],
                            justify="flex-end",
                        ),
                    ],
                ),
                dmc.Anchor(
                    href=f"/{name}/{str(item.id)}",
                    children=dmc.Text(str(item.name), fw="bold"),
                ),
                dmc.Text(str(item.description), size="sm", c="dimmed"),
                dmc.Space(h=10),
                dmc.Divider(),
                dmc.Space(h=10),
                dmc.Group(
                    justify="flex-end",
                    children=[
                        dmc.ActionIcon(
                            DashIconify(icon="zondicons:trash", width=100),
                            id=LIST_DELETE(str(item.id)),
                            size="sm",
                            n_clicks=0,
                            variant="white",
                        ),
                    ],
                ),
            ],
        )

    return dmc.Container(
        [
            dmc.SimpleGrid(
                id=LIST_GRID,
                cols={"base": 1, "sm": 2, "lg": 5},
                spacing={"base": 10, "sm": "xl"},
                verticalSpacing={"base": "md", "sm": "xl"},
            ),
            dmc.Affix(
                dmc.ActionIcon(
                    DashIconify(icon="zondicons:add-solid", width=100),
                    id=LIST_ADD,
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
                id=LIST_ADD_POPUP,
                title=dmc.Title(f"Add {label}", order=3),
                children=[
                    dmc.TextInput(
                        id=LIST_ADD_NAME,
                        label="Name",
                        placeholder=f"{label.capitalize()} name",
                        description=f"Enter a name for the new {label}",
                        size="sm",
                        required=True,
                    ),
                    dmc.TextInput(
                        id=LIST_ADD_DESCRIPTION,
                        label="Description",
                        placeholder=f"{label.capitalize()} description",
                        description=f"Enter a description for the new {label}",
                        size="sm",
                    ),
                    dmc.Space(h=20),
                    dmc.Group(
                        [
                            dmc.Button("Submit", id=LIST_ADD_SUBMIT),
                            dmc.Button(
                                "Cancel",
                                color="red",
                                variant="outline",
                                id=LIST_ADD_CANCEL,
                            ),
                        ],
                        justify="flex-end",
                    ),
                ],
            ),
        ]
    )
