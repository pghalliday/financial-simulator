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
    ASSOCIATION_TABLE,
)

logger = logging.getLogger(__name__)


class AssociationPostField(PostField[TABLE, POST], Generic[TABLE, POST, RELATED_TABLE, ASSOCIATION_TABLE]):
    __association_model: type[ASSOCIATION_TABLE]
    __association_field: str
    __model: type[RELATED_TABLE] | None

    def __init__(self, association_model: type[ASSOCIATION_TABLE], association_field: str, model: type[RELATED_TABLE] | None = None) -> None:
        self.__association_model = association_model
        self.__association_field = association_field
        self.__model = model

    def map(self, field: str, session: Session, item: TABLE, post_mapper: PostMapperInterface[TABLE, POST], item_post: POST) -> None:
        model = self.__model or post_mapper.table_model
        setattr(item, field, [
            self.__association_model(**{
                self.__association_field: get_related_item(
                    session,
                    model,
                    field,
                    association_reference.id,
                ),
            })
            for association_reference in getattr(item_post, field)
        ])

    def has_invalid_relation_error(self) -> bool:
        return True

