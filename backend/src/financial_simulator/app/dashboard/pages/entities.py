import logging
from typing import Any, Dict
from uuid import UUID

import dash
from dash import Input, callback, set_props
from sqlalchemy.orm import Session

import financial_simulator.app.dashboard.aio as aio
from financial_simulator.app.dashboard.aio.list.list import ListItemData
from financial_simulator.app.dashboard.constants import (
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    ENTITIES_HREF,
    ENTITIES_LABEL,
    ENTITIES_LIST_ID,
    ENTITIES_NAME,
    ENTITY_TYPES,
    EntityType,
    get_entity_href,
    get_entity_type,
)
from financial_simulator.app.dashboard.globals import get_db_engine
from financial_simulator.app.database.schema import (
    CorporationEntity,
    Entity,
    IndividualEntity,
)

logger = logging.getLogger(__name__)

dash.register_page(
    __name__,
    order=2,
    path=ENTITIES_HREF,
    name=ENTITIES_NAME,
    title=ENTITIES_NAME,
    match_path=lambda path: path == ENTITIES_HREF,
    header_data=lambda _: {
        "title": ENTITIES_NAME,
        "breadcrumbs": [
            {"label": COMPARE_SCENARIOS_NAME, "href": COMPARE_SCENARIOS_HREF},
            {"label": ENTITIES_NAME, "href": ENTITIES_HREF},
        ],
    },
)


def to_list_item_data(entity: Entity) -> ListItemData:
    return ListItemData(
        id=str(entity.id),
        name=str(entity.name),
        description=str(entity.description),
        href=get_entity_href(str(entity.id)),
        type=get_entity_type(EntityType(str(entity.type))),
    )


@callback(
    Input(aio.List.ids.add_action_store(ENTITIES_LIST_ID), "data"),
    config_prevent_initial_callbacks=True,
)
def add_entity(add_action_raw: Dict[str, Any]) -> None:
    add_action = aio.ListAddAction.model_validate(add_action_raw)
    if add_action.type == aio.ListAddActionType.ADD:
        with Session(get_db_engine()) as session:
            if add_action.add_data.type == EntityType.INDIVIDUAL:
                entity = IndividualEntity(
                    name=add_action.add_data.name,
                    description=add_action.add_data.description,
                )
            elif add_action.add_data.type == EntityType.CORPORATION:
                entity = CorporationEntity(
                    name=add_action.add_data.name,
                    description=add_action.add_data.description,
                )
            else:
                raise Exception(f"Unknown entity type: {add_action.add_data.type}")
            session.add(entity)
            session.commit()
            set_props(
                dash.ctx.triggered_id,
                {
                    "data": aio.ListAddAction(
                        type=aio.ListAddActionType.COMPLETE,
                        complete_data=to_list_item_data(entity),
                    ).model_dump()
                },
            )


@callback(
    Input(aio.List.ids.delete_action_store(ENTITIES_LIST_ID), "data"),
    config_prevent_initial_callbacks=True,
)
def delete_entity(delete_action_raw: Dict[str, Any]) -> None:
    delete_action = aio.ListDeleteAction.model_validate(delete_action_raw)
    if delete_action.type == aio.ListDeleteActionType.DELETE:
        with Session(get_db_engine()) as session:
            entity = session.get(Entity, UUID(delete_action.id))
            if entity is not None:
                session.delete(entity)
                session.commit()
            set_props(
                dash.ctx.triggered_id,
                {
                    "data": aio.ListDeleteAction(
                        type=aio.ListDeleteActionType.COMPLETE,
                        id=delete_action.id,
                    ).model_dump()
                },
            )


def layout():
    with Session(get_db_engine()) as session:
        entities = session.query(Entity).all()
        items = [to_list_item_data(entity) for entity in entities]
    return aio.List(
        aio_id=ENTITIES_LIST_ID,
        label=ENTITIES_LABEL,
        items=items,
        types=ENTITY_TYPES,
    )
