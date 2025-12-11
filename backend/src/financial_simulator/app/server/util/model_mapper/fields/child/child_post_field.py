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


class ChildPostField(PostField[TABLE, POST], Generic[TABLE, POST, RELATED_TABLE, RELATED_POST]):
    __post_mapper: PostMapper[RELATED_TABLE, RELATED_POST]

    def __init__(self, post_mapper: PostMapper[RELATED_TABLE, RELATED_POST]) -> None:
        self.__post_mapper = post_mapper

    def map(self, field: str, session: Session, item: TABLE, item_post: POST) -> None:
        child_post = getattr(item_post, field)
        setattr(item, field, self.__post_mapper.map(
            session,
            child_post,
        ) if child_post is not None else None)

    def has_invalid_relation_error(self) -> bool:
        return False

