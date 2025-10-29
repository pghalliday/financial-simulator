from typing import Sequence

from financial_simulator.app.server.util.model_mapper.fields.get_field import GetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    GetMapperInterface,
)


class TreeChildrenGetField(GetField[TABLE, GET]):
    def map(self, field: str, item: TABLE, get_mapper: GetMapperInterface[TABLE, GET], depth: int = 0, max_parents: int = 0) -> Sequence[GET]:
        return [
            get_mapper.map(sub_item, depth=depth - 1, max_parents=0) for sub_item in getattr(item, field)
        ] if (depth != 0) else []
