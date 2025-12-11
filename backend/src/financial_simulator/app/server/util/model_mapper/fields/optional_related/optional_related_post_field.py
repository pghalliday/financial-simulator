import logging

from sqlalchemy.orm import Session

from financial_simulator.app.server.util import get_optional_related_item
from ..post_field import PostField
from ...type_vars import POST, TABLE

logger = logging.getLogger(__name__)


class OptionalRelatedPostField(PostField[TABLE, POST]):
    __model: type[TABLE]

    def __init__(self, model: type[TABLE]):
        self.__model = model

    def map(self, field: str, session: Session, item: TABLE, item_post: POST) -> None:
        related_item = get_optional_related_item(
            session, self.__model, field, getattr(item_post, field)
        )
        setattr(item, field, related_item.id if related_item else None)

    def has_invalid_relation_error(self) -> bool:
        return True
