from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy.orm import Session

from .model_mapper import (
    ModelMapper,
    TABLE,
    GET,
    POST,
    PATCH,
)


class SimpleModelMapper(ModelMapper[TABLE, GET, POST, PATCH]):
    fields: Sequence[str] = []
    tree_children_fields: Sequence[str] = []
    tree_parent_fields: Sequence[str] = []

    def has_invalid_relation_error(self) -> bool:
        return False

    def map_get(self, item: TABLE, depth: int = 0, max_parents: int = 0) -> GET:
        params = {
            "id": item.id,
            **{field: getattr(item, field) for field in self.fields},
            **{
                field: [
                    self.map_get(sub_item, depth - 1, 0)
                    for sub_item in getattr(item, field)
                ]
                if (depth > 0 or depth < 0)
                else []
                for field in self.tree_children_fields
            },
            **{
                field: self.map_get(getattr(item, field), 0, max_parents - 1)
                if ((max_parents > 0 or max_parents < 0) and getattr(item, field))
                else None
                for field in self.tree_parent_fields
            },
        }
        return self.get_model(
            **params,
        )

    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        if item_id is not None:
            return self.table_model(id=item_id, **item_post.model_dump())
        return self.table_model(**item_post.model_dump())

    def map_patch(self, session: Session, item: TABLE, item_patch: POST) -> None:
        updated_data = item_patch.model_dump(exclude_unset=True)
        for key, value in updated_data.items():
            setattr(item, key, value)
