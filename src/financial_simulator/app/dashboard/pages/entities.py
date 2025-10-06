import logging
from contextlib import contextmanager
from typing import Any
from uuid import UUID

import dash
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.component_ids import (
    ENTITIES_LIST_ID,
    LOCATION_ID,
)
from financial_simulator.app.dashboard.components.list import create_list
from financial_simulator.app.dashboard.components.list.list import create_list_callbacks
from financial_simulator.app.dashboard.globals import get_db_engine
from financial_simulator.app.database.schema import (
    CorporationEntity,
    Entity,
    IndividualEntity,
)

ENTITY_TYPES = ["individual", "corporation"]
ENTITY_LABEL = "entity"
ENTITY_ROOT_HREF = "/entities/"

logger = logging.getLogger(__name__)

dash.register_page(
    __name__,
    order=2,
    path="/entities",
    name="Entities",
    title="Entities",
    match_path=lambda path: path == "/entities",
    header_data=lambda _: {
        "title": "Entities",
        "breadcrumbs": [
            {"label": "Home", "href": "/"},
            {"label": "Entities", "href": "/entities"},
        ],
    },
)


@contextmanager
def get_entities():
    with Session(get_db_engine()) as session:
        yield session.query(Entity).all()


@contextmanager
def add_entity(add_action_data: Any):
    with Session(get_db_engine()) as session:
        match add_action_data["type"]:
            case "individual":
                entity = IndividualEntity(
                    name=add_action_data["name"],
                    description=add_action_data["description"],
                )
            case "corporation":
                entity = CorporationEntity(
                    name=add_action_data["name"],
                    description=add_action_data["description"],
                )
            case _:
                raise Exception(f"Unknown type: {add_action_data['type']}")
        session.add(entity)
        session.commit()
        yield entity


@contextmanager
def delete_entity(entity_id: UUID):
    with Session(get_db_engine()) as session:
        entity = session.get(Entity, entity_id)
        if entity is not None:
            session.delete(entity)
            session.commit()
        yield entity


create_list_callbacks(
    ENTITIES_LIST_ID,
    ENTITY_ROOT_HREF,
    ENTITY_LABEL,
    ENTITY_TYPES,
    LOCATION_ID,
    add_entity,
    delete_entity,
)


def layout():
    return create_list(
        ENTITIES_LIST_ID,
        ENTITY_ROOT_HREF,
        ENTITY_LABEL,
        ENTITY_TYPES,
        get_entities,
    )
