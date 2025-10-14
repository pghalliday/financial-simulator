import logging
from enum import Enum
from typing import Sequence, TypeVar, Callable, Type, Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from financial_simulator.app.database.schema import Base
from financial_simulator.app.server.dependencies import get_db_session
from financial_simulator.app.server.errors import (
    HTTPNotFoundError,
    HTTPDatabaseIntegrityError,
    NotFoundError,
)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

TABLE = TypeVar("TABLE", bound=Base)
GET = TypeVar("GET", bound=BaseModel)
POST = TypeVar("POST", bound=BaseModel)
PATCH = TypeVar("PATCH", bound=BaseModel)

def create_router(
    prefix: str,
    tags: list[str | Enum] | None,
    table_model: Type[TABLE],
    get_model: Type[GET],
    post_model: Type[POST],
    patch_model: Type[PATCH],
    map_item: Callable[[TABLE], GET],
):
    router = APIRouter(
        prefix=prefix,
        tags=tags,
    )

    @router.get(
        "/",
        response_model=Sequence[get_model],
    )
    async def get_items(session: DBSessionDependency) -> Sequence[GET]:
        items = session.scalars(select(table_model))
        return [map_item(item) for item in items]

    @router.get(
        "/{item_id}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        },
    )
    async def get_item(item_id: UUID, session: DBSessionDependency) -> GET:
        item = session.get(table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        return map_item(item)

    @router.post(
        "/",
        response_model=get_model,
        responses={
            409: {
                "model": HTTPDatabaseIntegrityError,
                "description": "Database integrity error",
            },
        },
    )
    async def post_item(
        item_post: post_model, session: DBSessionDependency
    ) -> GET:
        item = table_model(**item_post.model_dump())
        session.add(item)
        session.commit()
        return map_item(item)

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
    async def put_item(
        item_id: UUID, item_post: post_model, session: DBSessionDependency
    ) -> GET:
        item = table_model(id=item_id, **item_post.model_dump())
        merged = session.merge(item)
        session.commit()
        return map_item(merged)

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
    async def patch_item(
            item_id: UUID, item_patch: patch_model, session: DBSessionDependency
    ) -> GET:
        item = session.get(table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        updated_data = item_patch.model_dump(exclude_unset=True)
        for key, value in updated_data.items():
            setattr(item, key, value)
        session.commit()
        return map_item(item)

    @router.delete(
        "/{item_id}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        }
    )
    async def delete_item(
            item_id: UUID, session: DBSessionDependency
    ) -> GET:
        item = session.get(table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        session.delete(item)
        session.commit()
        return map_item(item)

    return router
