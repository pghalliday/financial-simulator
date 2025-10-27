
from sqlalchemy.orm import Session

from financial_simulator.app.server.util import (
    get_related_item,
)
from financial_simulator.app.server.util.model_mapper.fields.post_field import PostField
from financial_simulator.app.server.util.model_mapper.types import POST, TABLE, FieldRelation


class RelatedPostField(PostField[TABLE, POST]):
    __field_relation: FieldRelation

    def __init__(self, field_relation: FieldRelation):
        self.__field_relation = field_relation

    def map(self, field: str, session: Session, item: TABLE, item_post: POST) -> None:
        setattr(item, self.__field_relation.field, get_related_item(
            session,
            self.__field_relation.model,
            self.__field_relation.field,
            getattr(item_post, field)
        ))

    def has_invalid_relation_error(self) -> bool:
        return True
