import logging
from typing import Sequence, TypeVar, Annotated, List, Generic
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
from financial_simulator.app.server.util.model_mapper import GetMapper, TABLE, GET

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

RELATED_TABLE = TypeVar("RELATED_TABLE", bound=BaseWithId)

class RelatedPost(BaseModel):
    id: UUID


class Relation(Generic[TABLE, RELATED_TABLE, GET]):
    relation_route: str
    relation_field: str
    table_model: type[TABLE]
    get_mapper: GetMapper[RELATED_TABLE, GET]

    def __init__(
            self,
            relation_route: str,
            relation_field: str,
            table_model: type[TABLE],
            get_mapper: GetMapper[RELATED_TABLE, GET]
    ) -> None:
        self.relation_route = relation_route
        self.relation_field = relation_field
        self.table_model = table_model
        self.get_mapper = get_mapper

    def add_endpoints(self, router: APIRouter):
        relation_route = self.relation_route
        relation_field = self.relation_field
        table_model = self.table_model
        get_mapper = self.get_mapper
        get_model = get_mapper.get_model

        @router.get(
            f"/{{item_id}}/{relation_route}/",
            response_model=List[get_model],
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
            response_model=get_model,
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
            response_model=get_model,
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
