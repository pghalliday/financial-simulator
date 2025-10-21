from uuid import UUID

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from financial_simulator.app.server.errors import RelationInvalidError


def get_related_item[T](session: Session, table: type[T], relation_name: str, related_item_id: UUID) -> T:
    related_item = session.get(table, related_item_id)
    if related_item is None:
        raise HTTPException(
            status_code=400, detail=jsonable_encoder(RelationInvalidError(
                relation_name=relation_name,
                id=related_item_id,
            ))
        )
    return related_item
