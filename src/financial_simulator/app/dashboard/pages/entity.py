import re
from uuid import UUID

import dash
import dash_mantine_components as dmc
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.globals import get_engine
from financial_simulator.app.database.schema import Entity

ENTITY_PATH_REGEX = r"/entities/([^/]+)"


def get_name(entity_id: str) -> str:
    with Session(get_engine()) as session:
        entity = session.get(Entity, UUID(entity_id))
        if not entity:
            return entity_id
        return str(entity.name)


def format_title(entity_name: str) -> str:
    return f"Entity - {entity_name}"


def get_title(entity_id: str) -> str:
    return format_title(get_name(entity_id))


def match_path(path: str) -> str | None:
    match = re.match(ENTITY_PATH_REGEX, path)
    if match:
        return match.group(1)
    return None


def header_data(entity_id: str):
    entity_name = get_name(entity_id)
    return {
        "title": format_title(entity_name),
        "breadcrumbs": [
            {"label": "Home", "href": "/"},
            {"label": "Entities", "href": "/entities"},
            {"label": entity_name, "href": f"/entities/{entity_id}"},
        ],
    }


dash.register_page(
    __name__,
    exclude_from_navbar=True,
    path_template="/entities/<entity_id>",
    name="Entity",
    title=get_title,
    match_path=match_path,
    header_data=header_data,
)


def layout(entity_id=None, **kwargs):
    return dmc.Container(
        dmc.Text(f"Entity ID: {entity_id}"),
    )
