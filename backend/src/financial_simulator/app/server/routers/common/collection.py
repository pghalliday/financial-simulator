import logging
from typing import Sequence, TypeVar, Callable, Type, Annotated, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, InstrumentedAttribute

from financial_simulator.app.database.schema import BaseWithNameAndDescription
from financial_simulator.app.server.dependencies import get_db_session
from financial_simulator.app.server.errors import (
    HTTPNotFoundError,
    HTTPDatabaseIntegrityError,
    NotFoundError,
)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

TABLE = TypeVar("TABLE", bound=BaseWithNameAndDescription)
GET = TypeVar("GET", bound=BaseModel)
POST = TypeVar("POST", bound=BaseModel)
PATCH = TypeVar("PATCH", bound=BaseModel)


def add_endpoints(
    router: APIRouter,
    table_model: Type[TABLE],
    order_by: InstrumentedAttribute[str],
    get_model: Type[GET],
    post_model: Type[POST],
    patch_model: Type[PATCH],
    map_item_get: Callable[[TABLE], GET],
    map_item_post: Optional[Callable[[POST, Optional[UUID]], TABLE]] = None,
    patch_item: Optional[Callable[[TABLE, PATCH], None]] = None,
):
    def __map_item_post(item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        if map_item_post is not None:
            return map_item_post(item_post, item_id)
        if item_id is not None:
            item = table_model(id=item_id, **item_post.model_dump())
            return item
        return table_model(**item_post.model_dump())

    def __patch_item(item: TABLE, item_patch: PATCH) -> None:
        if patch_item is not None:
            patch_item(item, item_patch)
        else:
            updated_data = item_patch.model_dump(exclude_unset=True)
            for key, value in updated_data.items():
                setattr(item, key, value)

    @router.get(
        "/",
        response_model=Sequence[get_model],
    )
    async def get_items_route(session: DBSessionDependency) -> Sequence[GET]:
        items = session.scalars(select(table_model).order_by(order_by))
        return [map_item_get(item) for item in items]

    @router.get(
        "/{item_id}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        },
    )
    async def get_item_route(item_id: UUID, session: DBSessionDependency) -> GET:
        item = session.get(table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        return map_item_get(item)

    @router.post(
        "/",
        status_code=201,
        response_model=get_model,
        responses={
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def post_item_route(
        item_post: post_model, session: DBSessionDependency
    ) -> GET:
        item = __map_item_post(item_post)
        session.add(item)
        session.commit()
        return map_item_get(item)

    @router.put(
        "/{item_id}",
        response_model=get_model,
        responses={
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def put_item_route(
        item_id: UUID, item_post: post_model, session: DBSessionDependency
    ) -> GET:
        item = __map_item_post(item_post, item_id)
        merged = session.merge(item)
        session.commit()
        return map_item_get(merged)

    @router.patch(
        "/{item_id}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def patch_item_route(
            item_id: UUID, item_patch: patch_model, session: DBSessionDependency
    ) -> GET:
        item = session.get(table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        __patch_item(item, item_patch)
        session.commit()
        return map_item_get(item)

    @router.delete(
        "/{item_id}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        }
    )
    async def delete_item_route(
            item_id: UUID, session: DBSessionDependency
    ) -> GET:
        item = session.get(table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        session.delete(item)
        session.commit()
        return map_item_get(item)
