import logging
from typing import (
    TypeVar,
    Annotated,
    Mapping,
    Union,
    Optional,
    Generic,
    List,
)
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, ColumnElement
from sqlalchemy.orm import Session, InstrumentedAttribute

from financial_simulator.app.database.schema import BaseWithType
from financial_simulator.app.server.dependencies import get_db_session
from financial_simulator.app.server.errors import (
    HTTPNotFoundError,
    HTTPDatabaseIntegrityError,
    HTTPChangeTypeError,
    ChangeTypeError,
    HTTPRelationInvalidError,
)
from financial_simulator.app.server.util import get_item
from financial_simulator.app.server.util.model_mapper import (
    ModelMapperInterface,
)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

class TypedBaseModel(BaseModel):
    type: str

TABLE = TypeVar("TABLE", bound=BaseWithType)
GET = TypeVar("GET", bound=TypedBaseModel)
POST = TypeVar("POST", bound=TypedBaseModel)

class TypedCollection(Generic[TABLE, GET, POST]):
    __table_model: type[TABLE]
    __get_model: type[GET]
    __post_model: type[POST]
    __model_mappers: Mapping[str, ModelMapperInterface[TABLE, GET, POST]]
    __order_by: Optional[InstrumentedAttribute[str]]
    __where: Optional[ColumnElement[bool]]

    def __init__(
            self,
            table_model: type[TABLE],
            get_model: type[GET],
            post_model: type[POST],
            model_mappers: Mapping[str, ModelMapperInterface[TABLE, GET, POST]],
            order_by: Optional[InstrumentedAttribute[str]] = None,
            where: Optional[ColumnElement[bool]] = None
    ) -> None:
        self.__table_model = table_model
        self.__get_model = get_model
        self.__post_model = post_model
        self.__model_mappers = model_mappers
        self.__order_by = order_by
        self.__where = where

    def add_endpoints(self, router: APIRouter):
        table_model = self.__table_model
        get_model = self.__get_model
        post_model = self.__post_model
        model_mappers = self.__model_mappers
        order_by = self.__order_by
        where = self.__where

        if any(model_mapper.has_invalid_relation_error for model_mapper in model_mappers.values()):
            invalid_relation_error = {
                400: {"model": HTTPRelationInvalidError, "description": "Relation invalid"},
            }
        else:
            invalid_relation_error = {}

        @router.get(
            "/",
        )
        async def get_items_route(session: DBSessionDependency) -> List[get_model]:
            query = select(table_model)
            if where is not None:
                query = query.where(where)
            if order_by is not None:
                query = query.order_by(order_by)
            items = session.scalars(query)
            return [model_mappers[item.type].map_get(item) for item in items]

        @router.get(
            "/{item_id}",
            responses={
                404: {"model": HTTPNotFoundError, "description": "Not found"},
            },
        )
        async def get_item_route(item_id: UUID, session: DBSessionDependency) -> get_model:
            item = get_item(session, table_model, item_id)
            return model_mappers[str(item.type)].map_get(item)

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
            item = model_mappers[item_post.type].map_post(session, item_post)
            session.add(item)
            session.commit()
            return model_mappers[item_post.type].map_get(item)

        @router.put(
            "/{item_id}",
            responses={
                **invalid_relation_error,
                409: {
                    "model": Union[HTTPDatabaseIntegrityError, HTTPChangeTypeError],
                    "description": "Database error",
                },
            },
        )
        async def put_item_route(
            item_id: UUID, item_post: post_model, session: DBSessionDependency
        ) -> get_model:
            item = session.get(table_model, item_id)
            if item:
                if item.type != item_post.type:
                    raise HTTPException(
                        status_code=409, detail=jsonable_encoder(ChangeTypeError(
                            current_type=item.type,
                            new_type=item_post.type,
                        ))
                    )
            item = model_mappers[item_post.type].map_post(session, item_post, item_id)
            merged = session.merge(item)
            session.commit()
            return model_mappers[item_post.type].map_get(merged)

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
            ret = model_mappers[str(item.type)].map_get(item)
            session.delete(item)
            session.commit()
            return ret
