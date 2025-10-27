from abc import abstractmethod, ABC
from typing import Generic, Any

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
)


class PatchField(ABC, Generic[TABLE]):
    @abstractmethod
    def has_invalid_relation_error(self) -> bool:
        raise NotImplementedError()

    @abstractmethod
    def map(self, field: str, session: Session, item: TABLE, value: Any) -> None:
        raise NotImplementedError()
