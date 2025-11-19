from sqlalchemy.orm import Session

from financial_simulator.app.server.util import get_optional_related_item
from ..post_field import PostField
from ...type_vars import POST, TABLE


class OptionalRelatedPostField(PostField[TABLE, POST]):
    __field: str
    __model: type[TABLE]

    def __init__(self, field: str, model: type[TABLE]):
        self.__field = field
        self.__model = model

    def map(self, field: str, session: Session, item: TABLE, item_post: POST) -> None:
        setattr(item, self.__field, get_optional_related_item(
            session,
            self.__model,
            self.__field,
            getattr(item_post, field)
        ))

    def has_invalid_relation_error(self) -> bool:
        return True
