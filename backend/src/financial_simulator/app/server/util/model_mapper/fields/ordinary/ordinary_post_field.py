from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.fields.post_field import PostField
from financial_simulator.app.server.util.model_mapper.types import PostMapperInterface, POST, TABLE


class OrdinaryPostField(PostField[TABLE, POST]):
    def map(self, field: str, session: Session, item: TABLE, post_mapper: PostMapperInterface[TABLE, POST], item_post: POST) -> None:
        setattr(item, field, getattr(item_post, field))

    def has_invalid_relation_error(self) -> bool:
        return False
