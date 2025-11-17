import logging
from typing import Optional, Mapping
from uuid import UUID

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.get_mapper import GetMapper
from financial_simulator.app.server.util.model_mapper.post_mapper import PostMapper
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    POST,
    ModelMapperInterface,
    TreeBehavior,
)

logger = logging.getLogger(__name__)

class ModelMapper(ModelMapperInterface[TABLE, GET, POST]):
    def __init__(
            self,
            table_model: type[TABLE],
            get_model: type[GET],
            post_model: type[POST],
            fields: Mapping[str, ModelField[TABLE, GET, POST]],
    ):
        self.table_model = table_model
        self.get_model = get_model
        self.post_model = post_model
        self.has_invalid_relation_error = any(field.has_invalid_relation_error() for field in fields.values())
        self.get_mapper = GetMapper[TABLE, GET](table_model, get_model, {field: model_field.get_field for field, model_field in fields.items()})
        self.post_mapper = PostMapper[TABLE, GET](table_model, get_model, {field: model_field.post_field for field, model_field in fields.items()})

    def map_get(self, item: TABLE) -> GET:
        return self.get_mapper.map(item, TreeBehavior())

    def map_post(self, session: Session, item_post: POST, item_id: Optional[UUID] = None) -> TABLE:
        return self.post_mapper.map(session, item_post, item_id)
