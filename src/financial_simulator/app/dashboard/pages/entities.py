from typing import Sequence

import dash
import dash_mantine_components as dmc  # type: ignore
from dash import Input, Output, callback
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.globals import get_engine
from financial_simulator.app.database.schema import Entity

EDIT_ENTITY_SELECTED = "edit-entity-selected"
EDIT_ENTITY_SELECTOR = "edit-entity-selector"

dash.register_page(__name__, order=2)

ENTITIES_TABLE_BODY = "entity-table-body"

head = dmc.TableThead(
    dmc.TableTr(
        [
            dmc.TableTh("Entity ID"),
            dmc.TableTh("Name"),
            dmc.TableTh("Description"),
        ]
    )
)
body = dmc.TableTbody(id=ENTITIES_TABLE_BODY)


# @callback(
#     Output(ENTITIES_TABLE_BODY, "children"),
#     Input(ENTITIES_TABLE_BODY, "children"),
# )
# def initialize_entities_table(_) -> Sequence[dmc.TableTr]:
#     return [
#         dmc.TableTr(
#             [
#                 dmc.TableTd(entity.id),
#                 dmc.TableTd(entity.name),
#                 dmc.TableTd(entity.description),
#             ]
#         )
#         for entity in get_api().list_entities()
#     ]
#
#
# layout = dmc.Container(
#     dmc.TableScrollContainer(
#         dmc.Table(
#             [head, body],
#             striped="odd",
#             highlightOnHover=True,
#             withTableBorder=True,
#             withColumnBorders=True,
#         ),
#         minWidth=600,
#         type="scrollarea",
#     ),
# )

layout = dmc.Container(
    [
        dmc.Autocomplete(
            label="Entity",
            placeholder="Select and existing entity to edit or create a new one",
            id=EDIT_ENTITY_SELECTOR,
            mb=10,
        ),
        dmc.Text(id=EDIT_ENTITY_SELECTED),
    ]
)


@callback(
    Output(EDIT_ENTITY_SELECTED, "children"), Input(EDIT_ENTITY_SELECTOR, "value")
)
def select_value(value):
    return f" You selected {value}"


@callback(
    Output(EDIT_ENTITY_SELECTOR, "data"),
    Input(EDIT_ENTITY_SELECTOR, "data"),
)
def initialize_entities_selector(_) -> Sequence[str]:
    with Session(get_engine()) as session:
        entities = session.query(Entity).all()
        return [str(entity.name) for entity in entities]
