from sqlalchemy.orm import Session

from ..post_field import PostField
from ...type_vars import POST, TABLE


class OrdinaryPostField(PostField[TABLE, POST]):
    def map(self, field: str, session: Session, item: TABLE, item_post: POST) -> None:
        setattr(item, field, getattr(item_post, field))

    def has_invalid_relation_error(self) -> bool:
        return False
