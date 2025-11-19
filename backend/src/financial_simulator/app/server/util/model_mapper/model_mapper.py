import logging
from typing import Optional, Self, Generic
from uuid import UUID

from sqlalchemy.orm import Session

from .fields.model_field import ModelField
from .get_mapper import GetMapper
from .post_mapper import PostMapper
from .type_vars import (
    TABLE,
    GET,
    POST,
)

logger = logging.getLogger(__name__)

class ModelMapper(Generic[TABLE, GET, POST]):
    table_model: type[TABLE]
    get_model: type[GET]
    post_model: type[POST]
    get_mapper: GetMapper[TABLE, GET]
    post_mapper: PostMapper[TABLE, POST]

    def __init__(
            self,
            table_model: type[TABLE],
            get_model: type[GET],
            post_model: type[POST],
    ):
        self.table_model = table_model
        self.get_model = get_model
        self.post_model = post_model
        self.get_mapper = GetMapper[TABLE, GET](table_model, get_model)
        self.post_mapper = PostMapper[TABLE, GET](table_model, get_model)

    def field(self, name: str, model_field: ModelField[TABLE, GET, POST]) -> Self:
        self.get_mapper.field(name, model_field.get_field)
        self.post_mapper.field(name, model_field.post_field)
        return self

    def map_get(self, item: TABLE) -> GET:
        return self.get_mapper.map(item)

    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        return self.post_mapper.map(session, item_post, item_id)

    def has_invalid_relation_error(self) -> bool:
        return self.post_mapper.has_invalid_relation_error()
