from abc import ABC, abstractmethod
from typing import Generic, Any

from ..type_vars import (
    TABLE,
    GET,
)

class GetField(ABC, Generic[TABLE, GET]):
    @abstractmethod
    def map(self, field: str, item: TABLE) -> Any:
        raise NotImplementedError()
