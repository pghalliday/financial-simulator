import logging
from typing import (
    Sequence,
    TypeVar,
    Callable,
    Type,
    Annotated,
    Mapping,
    Union,
)
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, InstrumentedAttribute

from financial_simulator.app.database.schema import BaseWithType
from financial_simulator.app.server.dependencies import get_db_session
from financial_simulator.app.server.errors import (
    HTTPNotFoundError,
    HTTPDatabaseIntegrityError,
    NotFoundError,
    HTTPChangeTypeError, ChangeTypeError,
)

DBSessionDependency = Annotated[Session, Depends(get_db_session)]

logger = logging.getLogger(__name__)

class TypedBaseModel(BaseModel):
    type: str

BASE_TABLE = TypeVar("BASE_TABLE", bound=BaseWithType)
TABLE = TypeVar("TABLE", bound=BaseWithType)
GET = TypeVar("GET", bound=TypedBaseModel)
POST = TypeVar("POST", bound=TypedBaseModel)
PATCH = TypeVar("PATCH", bound=TypedBaseModel)

def add_endpoints(
    router: APIRouter,
    base_table_model: Type[BASE_TABLE],
    order_by: InstrumentedAttribute[str],
    table_models: Mapping[str, Type[TABLE]],
    get_model: Type[GET],
    post_model: Type[POST],
    patch_model: Type[PATCH],
    item_get_mappers: Mapping[str, Callable[[TABLE], GET]],
):
    @router.get(
        "/",
        response_model=Sequence[get_model],
    )
    async def get_items_route(session: DBSessionDependency) -> Sequence[GET]:
        items = session.scalars(select(base_table_model).order_by(order_by))
        return [item_get_mappers[item.type](item) for item in items]

    @router.get(
        "/{item_id}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
        },
    )
    async def get_item_route(item_id: UUID, session: DBSessionDependency) -> GET:
        item = session.get(base_table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        return item_get_mappers[item.type](item)

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
        item = table_models[item_post.type](**item_post.model_dump())
        session.add(item)
        session.commit()
        return item_get_mappers[item_post.type](item)

    @router.put(
        "/{item_id}",
        response_model=get_model,
        responses={
            409: {
                "model": Union[HTTPDatabaseIntegrityError, HTTPChangeTypeError],
                "description": "Database error",
            },
        },
    )
    async def put_item_route(
        item_id: UUID, item_post: post_model, session: DBSessionDependency
    ) -> GET:
        item = session.get(base_table_model, item_id)
        if item:
            if item.type != item_post.type:
                raise HTTPException(
                    status_code=409, detail=jsonable_encoder(ChangeTypeError(
                        current_type=item.type,
                        new_type=item_post.type,
                    ))
                )
        item = table_models[item_post.type](id=item_id, **item_post.model_dump())
        merged = session.merge(item)
        session.commit()
        return item_get_mappers[item_post.type](merged)

    @router.patch(
        "/{item_id}",
        response_model=get_model,
        responses={
            404: {"model": HTTPNotFoundError, "description": "Not found"},
            409: {
                "model": Union[HTTPDatabaseIntegrityError, HTTPChangeTypeError],
                "description": "Database error",
            },
        },
    )
    async def patch_item_route(
            item_id: UUID, item_patch: patch_model, session: DBSessionDependency
    ) -> GET:
        item = session.get(base_table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        if item.type != item_patch.type:
            raise HTTPException(
                status_code=409, detail=jsonable_encoder(ChangeTypeError(
                    current_type=item.type,
                    new_type=item_patch.type,
                ))
            )
        updated_data = item_patch.model_dump(exclude_unset=True)
        for key, value in updated_data.items():
            setattr(item, key, value)
        session.commit()
        return item_get_mappers[item_patch.type](item)

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
        item = session.get(base_table_model, item_id)
        if not item:
            raise HTTPException(
                status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
            )
        session.delete(item)
        session.commit()
        return item_get_mappers[item.type](item)
