import logging
from typing import Generic

from sqlalchemy.orm import Session

from ...post_mapper import PostMapper
from ..post_field import PostField
from ...type_vars import (
    TABLE,
    POST,
    RELATED_TABLE,
    RELATED_POST,
)

logger = logging.getLogger(__name__)


class ChildrenPostField(PostField[TABLE, POST], Generic[TABLE, POST, RELATED_TABLE, RELATED_POST]):
    __post_mapper: PostMapper[RELATED_TABLE, RELATED_POST]

    def __init__(self, post_mapper: PostMapper[RELATED_TABLE, RELATED_POST]) -> None:
        self.__post_mapper = post_mapper

    def map(self, field: str, session: Session, item: TABLE, item_post: POST) -> None:
        setattr(item, field, [
            self.__post_mapper.map(
                session,
                child_item_post,
            )
            for child_item_post in getattr(item_post, field)
        ])

    def has_invalid_relation_error(self) -> bool:
        return False

