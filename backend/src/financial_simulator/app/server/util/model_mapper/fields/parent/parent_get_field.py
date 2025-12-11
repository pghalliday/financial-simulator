import logging
from typing import Generic

from ...get_mapper import GetMapper
from ..get_field import GetField
from ...type_vars import (
    TABLE,
    GET,
    RELATED_TABLE,
    RELATED_GET,
)

logger = logging.getLogger(__name__)


class ParentGetField(GetField[TABLE, GET], Generic[TABLE, GET, RELATED_TABLE, RELATED_GET]):
    __get_mapper: GetMapper[RELATED_TABLE, GET]

    def __init__(self, get_mapper: GetMapper[RELATED_TABLE, RELATED_GET]) -> None:
        self.__get_mapper = get_mapper

    def map(self, field: str, item: TABLE) -> RELATED_GET | None:
        parent = getattr(item, field)
        if parent is not None:
            return self.__get_mapper.map(parent)
        return None
