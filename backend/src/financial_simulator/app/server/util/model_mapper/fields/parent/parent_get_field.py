import logging
from typing import Generic

from financial_simulator.app.server.util.model_mapper.fields.get_field import GetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    GetMapperInterface,
    RELATED_TABLE,
    RELATED_GET,
)

logger = logging.getLogger(__name__)


class ParentGetField(GetField[TABLE, GET], Generic[TABLE, GET, RELATED_TABLE, RELATED_GET]):
    get_mapper: GetMapperInterface[RELATED_TABLE, GET] | None

    def __init__(self, get_mapper: GetMapperInterface[RELATED_TABLE, RELATED_GET] | None = None) -> None:
        self.get_mapper = get_mapper

    def map(self, field: str, item: TABLE, get_mapper: GetMapperInterface[TABLE, GET], depth: int = 0, max_parents: int = 0) -> GET | None:
        get_mapper = self.get_mapper or get_mapper
        if max_parents != 0:
            parent = getattr(item, field)
            if parent is not None:
                return get_mapper.map(parent, depth=0, max_parents=max_parents - 1)
        return None
