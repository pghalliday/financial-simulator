from typing import Any

from financial_simulator.app.server.util.model_mapper.fields.get_field import GetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    GetMapperInterface,
)


class OrdinaryGetField(GetField[TABLE, GET]):
    def map(self, field: str, item: TABLE, get_mapper: GetMapperInterface[TABLE, GET], depth: int = 0, max_parents: int = 0) -> Any:
        return getattr(item, field)
