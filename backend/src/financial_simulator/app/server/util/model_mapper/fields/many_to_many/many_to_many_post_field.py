import logging
from typing import Generic

from sqlalchemy.orm import Session

from financial_simulator.app.server.util import get_related_item
from ..post_field import PostField
from ...type_vars import (
    TABLE,
    POST,
    RELATED_TABLE,
)

logger = logging.getLogger(__name__)


class ManyToManyPostField(PostField[TABLE, POST], Generic[TABLE, POST, RELATED_TABLE]):
    __model: type[RELATED_TABLE]

    def __init__(self, model: type[RELATED_TABLE]) -> None:
        self.__model = model

    def map(self, field: str, session: Session, item: TABLE, item_post: POST) -> None:
        setattr(item, field, [
            get_related_item(
                session,
                self.__model,
                field,
                many_to_many_reference.id,
            )
            for many_to_many_reference in getattr(item_post, field)
        ])

    def has_invalid_relation_error(self) -> bool:
        return True

