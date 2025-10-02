import logging
from contextlib import contextmanager
from typing import Any
from uuid import UUID

import dash
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.components.list import create_list
from financial_simulator.app.dashboard.globals import get_engine
from financial_simulator.app.database.schema import Entity

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
    with Session(get_engine()) as session:
        yield session.query(Entity).all()


@contextmanager
def add_entity(add_action_data: Any):
    with Session(get_engine()) as session:
        entity = Entity(
            name=add_action_data["name"], description=add_action_data["description"]
        )
        session.add(entity)
        session.commit()
        yield entity


@contextmanager
def delete_entity(entity_id: UUID):
    with Session(get_engine()) as session:
        entity = session.get(Entity, entity_id)
        if entity is not None:
            session.delete(entity)
            session.commit()
        yield entity


layout = create_list(
    "entities",
    "/entities",
    "entity",
    get_entities,
    add_entity,
    delete_entity,
)
