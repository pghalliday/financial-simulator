import logging
from typing import Sequence, TypeVar, Callable, Type, Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import Base, BaseWithId
from financial_simulator.app.server.dependencies import get_db_session
from financial_simulator.app.server.errors import (
    HTTPNotFoundError,
    HTTPDatabaseIntegrityError,
    HTTPRelationInvalidError,
    HTTPRelatedItemNotFoundError,
)
from financial_simulator.app.server.util import (
    get_related_item,
    get_item,
    find_related_item,
)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

TABLE = TypeVar("TABLE", bound=BaseWithId)
RELATED_TABLE = TypeVar("RELATED_TABLE", bound=Base)
GET = TypeVar("GET", bound=BaseModel)
POST = TypeVar("POST", bound=BaseModel)


def add_endpoints(
    router: APIRouter,
    relation_name: str,
    table_model: Type[TABLE],
    related_table_model: Type[RELATED_TABLE],
    get_model: Type[GET],
    post_model: Type[POST],
    map_related_item: Callable[[RELATED_TABLE], GET],
):
    @router.get(
        f"/{{item_id}}/{relation_name}/",
        response_model=Sequence[get_model],
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        }
    )
    async def get_related_items_route(item_id: UUID, session: DBSessionDependency) -> Sequence[GET]:
        return [map_related_item(related_item) for related_item in getattr(
            get_item(session, table_model, item_id),
            relation_name
        )]

    @router.post(
        f"/{{item_id}}/{relation_name}/",
        status_code=201,
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
            400: {"model": HTTPRelationInvalidError, "description": "Relation invalid"},
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def post_related_item_route(item_id: UUID, item_post: post_model, session: DBSessionDependency) -> GET:
        item = get_item(session, table_model, item_id)
        related_item = get_related_item(
            session, related_table_model, relation_name, item_post.id
        )
        getattr(item, relation_name).append(related_item)
        session.commit()
        return map_related_item(related_item)

    @router.get(
        f"/{{item_id}}/{relation_name}/{{related_item_id}}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError | HTTPRelatedItemNotFoundError, "description": "Not found"},
        },
    )
    async def get_related_item_route(item_id: UUID, related_item_id: UUID, session: DBSessionDependency) -> GET:
        return map_related_item(find_related_item(
            table_model,
            related_table_model,
            relation_name,
            get_item(session, table_model, item_id),
            related_item_id,
        ))

    @router.delete(
        f"/{{item_id}}/{relation_name}/{{related_item_id}}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError | HTTPRelatedItemNotFoundError, "description": "Not found"},
        },
    )
    async def delete_related_item_route(item_id: UUID, related_item_id: UUID, session: DBSessionDependency) -> GET:
        item = get_item(session, table_model, item_id)
        related_item = find_related_item(
            table_model,
            related_table_model,
            relation_name,
            item,
            related_item_id,
        )
        getattr(item, relation_name).remove(related_item)
        session.commit()
        return map_related_item(related_item)
