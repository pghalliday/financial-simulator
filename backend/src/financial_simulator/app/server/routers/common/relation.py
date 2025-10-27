import logging
from typing import Sequence, TypeVar, Type, Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import BaseWithId
from financial_simulator.app.server.dependencies import get_db_session
from financial_simulator.app.server.errors import (
    HTTPNotFoundError,
    HTTPDatabaseIntegrityError,
    HTTPRelationInvalidError,
    HTTPRelatedItemNotFoundError,
)
from financial_simulator.app.server.util import (
    get_item,
    find_related_item,
    get_related_item,
)
from financial_simulator.app.server.util.model_mapper import GetMapper

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

TABLE = TypeVar("TABLE", bound=BaseWithId)
RELATED_TABLE = TypeVar("RELATED_TABLE", bound=BaseWithId)
GET = TypeVar("GET", bound=BaseModel)

class RelatedPost(BaseModel):
    id: UUID


def add_endpoints(
    router: APIRouter,
    relation_route: str,
    relation_field: str,
    table_model: Type[TABLE],
    get_mapper: GetMapper[RELATED_TABLE, GET],
):
    @router.get(
        f"/{{item_id}}/{relation_route}/",
        response_model=Sequence[get_mapper.get_model],
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        }
    )
    async def get_related_items_route(item_id: UUID, session: DBSessionDependency, depth: int = 0, max_parents: int = 0) -> Sequence[GET]:
        return [get_mapper.map(related_item, depth, max_parents) for related_item in getattr(
            get_item(session, table_model, item_id),
            relation_field
        )]

    @router.post(
        f"/{{item_id}}/{relation_route}/",
        status_code=201,
        response_model=get_mapper.get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
            400: {"model": HTTPRelationInvalidError, "description": "Relation invalid"},
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def post_related_item_route(item_id: UUID, related_post: RelatedPost, session: DBSessionDependency) -> GET:
        item = get_item(session, table_model, item_id)
        related_item = get_related_item(
            session, get_mapper.table_model, relation_field, related_post.id
        )
        getattr(item, relation_field).append(related_item)
        session.commit()
        return get_mapper.map(related_item)

    @router.get(
        f"/{{item_id}}/{relation_route}/{{related_item_id}}",
        response_model=get_mapper.get_model,
        responses={
            404: {"model": HTTPNotFoundError | HTTPRelatedItemNotFoundError, "description": "Not found"},
        },
    )
    async def get_related_item_route(item_id: UUID, related_item_id: UUID, session: DBSessionDependency, depth: int = 0, max_parents: int = 0) -> GET:
        return get_mapper.map(find_related_item(
            table_model,
            get_mapper.table_model,
            relation_field,
            get_item(session, table_model, item_id),
            related_item_id,
        ), depth, max_parents)

    @router.delete(
        f"/{{item_id}}/{relation_route}/{{related_item_id}}",
        response_model=get_mapper.get_model,
        responses={
            404: {"model": HTTPNotFoundError | HTTPRelatedItemNotFoundError, "description": "Not found"},
        },
    )
    async def delete_related_item_route(item_id: UUID, related_item_id: UUID, session: DBSessionDependency) -> GET:
        item = get_item(session, table_model, item_id)
        related_item = find_related_item(
            table_model,
            get_mapper.table_model,
            relation_field,
            item,
            related_item_id,
        )
        getattr(item, relation_field).remove(related_item)
        session.commit()
        return get_mapper.map(related_item)
