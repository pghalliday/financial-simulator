from uuid import UUID

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder

from financial_simulator.app.server.errors import RelatedItemNotFoundError


def find_related_item[T, U](table: type[U], related_table: type[T], relation_name: str, item: U, related_item_id: UUID) -> T:
    related_item = next(
        (
            related_item
            for related_item
            in getattr(item, relation_name)
            if related_item.id == related_item_id
        ),
        None,
    )
    if related_item is None:
        raise HTTPException(
            status_code=404,
            detail=jsonable_encoder(
                RelatedItemNotFoundError(
                    relation_name=relation_name,
                    id=related_item_id,
                )
            ),
        )
    return related_item
