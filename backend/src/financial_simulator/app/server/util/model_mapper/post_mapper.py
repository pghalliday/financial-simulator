from typing import Optional, Dict
from uuid import UUID

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.fields.post_field import PostField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    PostMapperInterface,
)


class PostMapper(PostMapperInterface[TABLE, POST]):
    __fields: Dict[str, PostField[TABLE, POST] | None]

    def __init__(self, table_model: type[TABLE], post_model: type[POST], fields: Dict[str, PostField[TABLE, POST]]) -> None:
        self.table_model = table_model
        self.post_model = post_model
        self.__fields = fields

    def map(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        item = self.table_model()
        if item_id is not None:
            item.id = item_id
        for field, post_field in self.__fields.items():
            if post_field is not None:
                post_field.map(field, session, item, self.table_model, item_post)
        return item
