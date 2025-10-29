import logging
from typing import Annotated, Optional, List, Generic
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select, ColumnElement
from sqlalchemy.orm import Session, InstrumentedAttribute

from financial_simulator.app.server.dependencies import get_db_session
from financial_simulator.app.server.errors import (
    HTTPNotFoundError,
    HTTPDatabaseIntegrityError,
    HTTPRelationInvalidError,
)
from financial_simulator.app.server.util import get_item
from financial_simulator.app.server.util.model_mapper import (
    TABLE,
    GET,
    POST,
    PATCH,
    ModelMapperInterface,
)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

class Collection(Generic[TABLE, GET, POST, PATCH]):
    __model_mapper: ModelMapperInterface[TABLE, GET, POST, PATCH]
    __order_by: Optional[InstrumentedAttribute[str]]
    __where: Optional[ColumnElement[bool]]

    def __init__(
            self,
            model_mapper: ModelMapperInterface[TABLE, GET, POST, PATCH],
            order_by: Optional[InstrumentedAttribute[str]] = None,
            where: Optional[ColumnElement[bool]] = None
    ) -> None:
        self.__model_mapper = model_mapper
        self.__order_by = order_by
        self.__where = where

    def add_endpoints(self, router: APIRouter):
        model_mapper = self.__model_mapper
        order_by = self.__order_by
        where = self.__where
        table_model = model_mapper.table_model
        get_model = model_mapper.get_model
        post_model = model_mapper.post_model
        patch_model = model_mapper.patch_model

        if model_mapper.has_invalid_relation_error:
            invalid_relation_error = {
                400: {"model": HTTPRelationInvalidError, "description": "Relation invalid"},
            }
        else:
            invalid_relation_error = {}

        @router.get(
            "/",
        )
        async def get_items_route(session: DBSessionDependency, depth: int = 0, max_parents: int = 0) -> List[get_model]:
            query = select(table_model)
            if where is not None:
                query = query.where(where)
            if order_by is not None:
                query = query.order_by(order_by)
            items = session.scalars(query)
            return [model_mapper.map_get(item, depth, max_parents) for item in items]

        @router.get(
            "/{item_id}",
            responses={
                404: {"model": HTTPNotFoundError, "description": "Not found"},
            },
        )
        async def get_item_route(item_id: UUID, session: DBSessionDependency, depth: int = 0, max_parents: int = 0) -> get_model:
            logger.info(f"Getting item {item_id}")
            return model_mapper.map_get(get_item(session, table_model, item_id), depth, max_parents)

        @router.post(
            "/",
            status_code=201,
            responses={
                **invalid_relation_error,
                409: {
                    "model": HTTPDatabaseIntegrityError,
                    "description": "Database integrity error",
                },
            },
        )
        async def post_item_route(
            item_post: post_model, session: DBSessionDependency
        ) -> get_model:
            item = model_mapper.map_post(session, item_post)
            session.add(item)
            session.commit()
            return model_mapper.map_get(item)

        @router.put(
            "/{item_id}",
            responses={
                **invalid_relation_error,
                409: {
                    "model": HTTPDatabaseIntegrityError,
                    "description": "Database integrity error",
                },
            },
        )
        async def put_item_route(
            item_id: UUID, item_post: post_model, session: DBSessionDependency
        ) -> get_model:
            item = model_mapper.map_post(session, item_post, item_id)
            merged = session.merge(item)
            session.commit()
            return model_mapper.map_get(merged)

        @router.patch(
            "/{item_id}",
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
                item_id: UUID, item_patch: patch_model, session: DBSessionDependency
        ) -> get_model:
            item = get_item(session, table_model, item_id)
            model_mapper.map_patch(session, item, item_patch)
            session.commit()
            return model_mapper.map_get(item)

        @router.delete(
            "/{item_id}",
            responses={
                404: {"model": HTTPNotFoundError, "description": "Not found"},
            }
        )
        async def delete_item_route(
                item_id: UUID, session: DBSessionDependency
        ) -> get_model:
            item = get_item(session, table_model, item_id)
            session.delete(item)
            session.commit()
            return model_mapper.map_get(item)
