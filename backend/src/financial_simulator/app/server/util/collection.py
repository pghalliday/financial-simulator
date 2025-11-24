import logging
from typing import Annotated, List, Generic
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

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
    ModelMapper,
)
from financial_simulator.app.server.util.query_params import (
    QUERY_PARAMS,
    DefaultQueryParams,
)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

class Collection(Generic[TABLE, GET, POST, QUERY_PARAMS]):
    __model_mapper: ModelMapper[TABLE, GET, POST]
    __query_params_class: type[QUERY_PARAMS]

    def __init__(
            self,
            model_mapper: ModelMapper[TABLE, GET, POST],
            query_params_class: type[QUERY_PARAMS] = DefaultQueryParams,
    ) -> None:
        self.__model_mapper = model_mapper
        self.__query_params_class = query_params_class

    def add_endpoints(self, router: APIRouter):
        model_mapper = self.__model_mapper
        query_params_class = self.__query_params_class
        table_model = model_mapper.table_model
        get_model = model_mapper.get_model
        post_model = model_mapper.post_model

        if model_mapper.has_invalid_relation_error():
            invalid_relation_error = {
                400: {"model": HTTPRelationInvalidError, "description": "Relation invalid"},
            }
        else:
            invalid_relation_error = {}

        @router.get(
            "/",
        )
        async def get_items_route(session: DBSessionDependency, query_params: Annotated[query_params_class, Query()]) -> List[get_model]:
            query = select(table_model)
            limit = query_params.query_limit()
            offset = query_params.query_offset()
            order_by = query_params.query_order_by()
            where = query_params.query_where()
            if limit is not None:
                query = query.limit(limit)
            if offset is not None:
                query = query.limit(offset)
            if order_by is not None:
                query = query.order_by(order_by)
            if where is not None:
                query = query.where(where)
            items = session.scalars(query)
            return [model_mapper.map_get(item) for item in items]

        @router.get(
            "/{item_id}",
            responses={
                404: {"model": HTTPNotFoundError, "description": "Not found"},
            },
        )
        async def get_item_route(item_id: UUID, session: DBSessionDependency) -> get_model:
            logger.info(f"Getting item {item_id}")
            return model_mapper.map_get(get_item(session, table_model, item_id))

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
            ret = model_mapper.map_get(item)
            session.delete(item)
            session.commit()
            return ret
