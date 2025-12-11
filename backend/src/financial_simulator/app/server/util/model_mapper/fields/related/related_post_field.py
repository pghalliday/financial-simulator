from sqlalchemy.orm import Session

from financial_simulator.app.server.util import (
    get_related_item,
)
from ..post_field import PostField
from ...type_vars import POST, TABLE


class RelatedPostField(PostField[TABLE, POST]):
    __model: type[TABLE]

    def __init__(self, model: type[TABLE]) -> None:
        self.__model = model

    def map(self, field: str, session: Session, item: TABLE, item_post: POST) -> None:
        related_item = get_related_item(
            session, self.__model, field, getattr(item_post, field)
        )
        setattr(item, field, related_item.id)

    def has_invalid_relation_error(self) -> bool:
        return True
