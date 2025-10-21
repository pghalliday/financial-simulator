import logging
from typing import Sequence, TypeVar, Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, InstrumentedAttribute

from financial_simulator.app.database.schema import BaseWithNameAndDescription
from financial_simulator.app.server.dependencies import get_db_session
from financial_simulator.app.server.errors import (
    HTTPNotFoundError,
    HTTPDatabaseIntegrityError,
    HTTPRelationInvalidError,
)
from financial_simulator.app.server.util import get_item, ModelMapper

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

TABLE = TypeVar("TABLE", bound=BaseWithNameAndDescription)
GET = TypeVar("GET", bound=BaseModel)
POST = TypeVar("POST", bound=BaseModel)
PATCH = TypeVar("PATCH", bound=BaseModel)


def add_endpoints(
    router: APIRouter,
    order_by: InstrumentedAttribute[str],
    model_mapper: ModelMapper,
):
    if model_mapper.has_invalid_relation_error():
        invalid_relation_error = {
            400: {"model": HTTPRelationInvalidError, "description": "Relation invalid"},
        }
    else:
        invalid_relation_error = {}

    @router.get(
        "/",
        response_model=Sequence[model_mapper.get_model],
    )
    async def get_items_route(session: DBSessionDependency) -> Sequence[GET]:
        items = session.scalars(select(model_mapper.table_model).order_by(order_by))
        return [model_mapper.map_get(item) for item in items]

    @router.get(
        "/{item_id}",
        response_model=model_mapper.get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        },
    )
    async def get_item_route(item_id: UUID, session: DBSessionDependency) -> GET:
        logger.info(f"Getting item {item_id}")
        return model_mapper.map_get(get_item(session, model_mapper.table_model, item_id))

    @router.post(
        "/",
        status_code=201,
        response_model=model_mapper.get_model,
        responses={
            **invalid_relation_error,
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def post_item_route(
        item_post: model_mapper.post_model, session: DBSessionDependency
    ) -> GET:
        item = model_mapper.map_post(session, item_post)
        session.add(item)
        session.commit()
        return model_mapper.map_get(item)

    @router.put(
        "/{item_id}",
        response_model=model_mapper.get_model,
        responses={
            **invalid_relation_error,
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def put_item_route(
        item_id: UUID, item_post: model_mapper.post_model, session: DBSessionDependency
    ) -> GET:
        item = model_mapper.map_post(session, item_post, item_id)
        merged = session.merge(item)
        session.commit()
        return model_mapper.map_get(merged)

    @router.patch(
        "/{item_id}",
        response_model=model_mapper.get_model,
        responses={
            **invalid_relation_error,
            404: {"model": HTTPNotFoundError, "description": "Not found"},
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def patch_item_route(
            item_id: UUID, item_patch: model_mapper.patch_model, session: DBSessionDependency
    ) -> GET:
        item = get_item(session, model_mapper.table_model, item_id)
        model_mapper.map_patch(session, item, item_patch)
        session.commit()
        return model_mapper.map_get(item)

    @router.delete(
        "/{item_id}",
        response_model=model_mapper.get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        }
    )
    async def delete_item_route(
            item_id: UUID, session: DBSessionDependency
    ) -> GET:
        item = get_item(session, model_mapper.table_model, item_id)
        session.delete(item)
        session.commit()
        return model_mapper.map_get(item)
