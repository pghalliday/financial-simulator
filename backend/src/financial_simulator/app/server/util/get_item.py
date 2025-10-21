from uuid import UUID

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from financial_simulator.app.server.errors import NotFoundError


def get_item[T](session: Session, table: type[T], item_id: UUID) -> T:
    item = session.get(table, item_id)
    if item is None:
        raise HTTPException(
            status_code=404, detail=jsonable_encoder(NotFoundError(id=item_id))
        )
    return item
