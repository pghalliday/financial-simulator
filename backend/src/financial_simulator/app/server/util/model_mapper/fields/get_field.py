from abc import ABC, abstractmethod
from typing import Generic, Any

from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    GetMapperInterface,
)

class GetField(ABC, Generic[TABLE, GET]):
    @abstractmethod
    def map(self, field: str, item: TABLE, get_mapper: GetMapperInterface[TABLE, GET], depth: int = 0, max_parents: int = 0) -> Any:
        raise NotImplementedError()
