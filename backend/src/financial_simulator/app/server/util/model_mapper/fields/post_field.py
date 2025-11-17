from abc import ABC, abstractmethod
from typing import Generic

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.types import PostMapperInterface, POST, TABLE


class PostField(ABC, Generic[TABLE, POST]):
    @abstractmethod
    def has_invalid_relation_error(self) -> bool:
        raise NotImplementedError()

    @abstractmethod
    def map(self, field: str, session: Session, item: TABLE, post_mapper: PostMapperInterface[TABLE, POST], item_post: POST) -> None:
        raise NotImplementedError()
