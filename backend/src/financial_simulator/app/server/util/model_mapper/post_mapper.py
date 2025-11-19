from typing import Optional, Dict, Self, Generic
from uuid import UUID

from sqlalchemy.orm import Session

from .fields.post_field import PostField
from .type_vars import (
    TABLE,
    POST,
)


class PostMapper(Generic[TABLE, POST]):
    table_model: type[TABLE]
    post_model: type[POST]
    __fields: Dict[str, PostField[TABLE, POST]]

    def __init__(self, table_model: type[TABLE], post_model: type[POST]) -> None:
        self.table_model = table_model
        self.post_model = post_model
        self.__fields = {}

    def field(self, name: str, post_field: PostField[TABLE, POST] | None) -> Self:
        if post_field is not None:
            self.__fields[name] = post_field
        return self

    def map(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        item = self.table_model()
        if item_id is not None:
            item.id = item_id
        for field, post_field in self.__fields.items():
            post_field.map(field, session, item, item_post)
        return item

    def has_invalid_relation_error(self) -> bool:
        return any(field.has_invalid_relation_error() for field in self.__fields.values())
