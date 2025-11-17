import logging
from typing import Generic

from sqlalchemy.orm import Session

from financial_simulator.app.server.util import get_related_item
from financial_simulator.app.server.util.model_mapper.fields.post_field import PostField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    RELATED_TABLE,
    PostMapperInterface,
)

logger = logging.getLogger(__name__)


class ManyToManyPostField(PostField[TABLE, POST], Generic[TABLE, POST, RELATED_TABLE]):
    __model: type[RELATED_TABLE] | None

    def __init__(self, model: type[RELATED_TABLE] | None = None) -> None:
        self.__model = model

    def map(self, field: str, session: Session, item: TABLE, post_mapper: PostMapperInterface[TABLE, POST], item_post: POST) -> None:
        model = self.__model or post_mapper.table_model
        setattr(item, field, [
            get_related_item(
                session,
                model,
                field,
                many_to_many_reference.id,
            )
            for many_to_many_reference in getattr(item_post, field)
        ])

    def has_invalid_relation_error(self) -> bool:
        return True

