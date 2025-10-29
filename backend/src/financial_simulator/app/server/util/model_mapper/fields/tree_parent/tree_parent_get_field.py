import logging

from financial_simulator.app.server.util.model_mapper.fields.get_field import GetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    GetMapperInterface,
)

logger = logging.getLogger(__name__)


class TreeParentGetField(GetField[TABLE, GET]):
    def map(self, field: str, item: TABLE, get_mapper: GetMapperInterface[TABLE, GET], depth: int = 0, max_parents: int = 0) -> GET | None:
        if max_parents != 0:
            parent = getattr(item, field)
            if parent is not None:
                return get_mapper.map(parent, depth=0, max_parents=max_parents - 1)
        return None
