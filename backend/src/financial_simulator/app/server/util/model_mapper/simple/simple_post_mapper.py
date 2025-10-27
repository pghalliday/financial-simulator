from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.post_mapper import (
    PostMapper,
    TABLE,
    POST,
)


class SimplePostMapper(PostMapper[TABLE, POST]):
    fields: Sequence[str] = []
    tree_children_fields: Sequence[str] = []
    tree_parent_fields: Sequence[str] = []

    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        if item_id is not None:
            return self.table_model(id=item_id, **item_post.model_dump())
        return self.table_model(**item_post.model_dump())
