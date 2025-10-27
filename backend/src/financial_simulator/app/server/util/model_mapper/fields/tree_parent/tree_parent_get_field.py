
from financial_simulator.app.server.util.model_mapper.fields.get_field import GetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    GetMapperInterface,
)


class TreeParentGetField(GetField[TABLE, GET]):
    def map(self, field: str, item: TABLE, get_mapper: GetMapperInterface[TABLE, GET], depth: int = 0, max_parents: int = 0) -> GET | None:
        parent = getattr(item, field)
        if parent is None:
            return None
        return get_mapper.map(getattr(item, field), depth=0, max_parents=max_parents - 1) if (max_parents > 0 or max_parents < 0) else None
