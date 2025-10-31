import logging
from typing import Generic

from sqlalchemy.orm import Session

from financial_simulator.app.server.util import get_related_item
from financial_simulator.app.server.util.model_mapper.fields.post_field import PostField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    RELATED_TABLE,
)

logger = logging.getLogger(__name__)


class ChildrenPostField(PostField[TABLE, POST], Generic[TABLE, POST, RELATED_TABLE]):
    __model: type[RELATED_TABLE] | None

    def __init__(self, model: type[RELATED_TABLE] | None = None) -> None:
        self.__model = model

    def map(self, field: str, session: Session, item: TABLE, model: type[TABLE], item_post: POST) -> None:
        model = self.__model or model
        setattr(item, field, [
            get_related_item(
                session,
                model,
                field,
                child_reference.id,
            )
            for child_reference in getattr(item_post, field)
        ])

    def has_invalid_relation_error(self) -> bool:
        return True

