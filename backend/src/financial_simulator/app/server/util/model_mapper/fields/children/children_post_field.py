import logging
from typing import Generic

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.fields.post_field import PostField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    RELATED_TABLE,
    RELATED_POST,
    PostMapperInterface,
)

logger = logging.getLogger(__name__)


class ChildrenPostField(PostField[TABLE, POST], Generic[TABLE, POST, RELATED_TABLE, RELATED_POST]):
    __post_mapper: PostMapperInterface[RELATED_TABLE, RELATED_POST] | None

    def __init__(self, post_mapper: PostMapperInterface[RELATED_TABLE, RELATED_POST] | None = None) -> None:
        self.__post_mapper = post_mapper

    def map(self, field: str, session: Session, item: TABLE, post_mapper: PostMapperInterface[TABLE, POST], item_post: POST) -> None:
        post_mapper = self.__post_mapper or post_mapper
        setattr(item, field, [
            post_mapper.map(
                session,
                child_item_post,
            )
            for child_item_post in getattr(item_post, field)
        ])

    def has_invalid_relation_error(self) -> bool:
        return False

