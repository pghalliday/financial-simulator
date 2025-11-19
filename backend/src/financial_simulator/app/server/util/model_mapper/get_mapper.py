import logging
from typing import Self, Dict, Generic

from .fields.get_field import GetField
from .type_vars import (
    TABLE,
    GET,
)

logger = logging.getLogger(__name__)

class GetMapper(Generic[TABLE, GET]):
    table_model: type[TABLE]
    get_model: type[GET]
    __fields: Dict[str, GetField[TABLE, GET]]

    def __init__(self, table_model: type[TABLE], get_model: type[GET]) -> None:
        self.table_model = table_model
        self.get_model = get_model
        self.__fields = {}

    def field(self, name: str, get_field: GetField[TABLE, GET]) -> Self:
        self.__fields[name] = get_field
        return self

    def map(self, item: TABLE) -> GET:
        return self.get_model(
            id=item.id,
            **{
                field: get_field.map(field, item)
                for field, get_field
                in self.__fields.items()
                if get_field is not None
            },
        )
