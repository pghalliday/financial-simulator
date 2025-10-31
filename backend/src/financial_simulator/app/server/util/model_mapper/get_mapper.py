import logging
from typing import Mapping


from financial_simulator.app.server.util.model_mapper.fields.get_field import GetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    GetMapperInterface,
    TreeBehavior,
)

logger = logging.getLogger(__name__)

class GetMapper(GetMapperInterface[TABLE, GET]):
    __fields: Mapping[str, GetField[TABLE, GET] | None]

    def __init__(self, table_model: type[TABLE], get_model: type[GET], fields: Mapping[str, GetField[TABLE, GET]]) -> None:
        self.table_model = table_model
        self.get_model = get_model
        self.__fields = fields

    def map(self, item: TABLE, tree_behavior: TreeBehavior) -> GET:
        return self.get_model(
            id=item.id,
            **{
                field: get_field.map(field, item, self, tree_behavior)
                for field, get_field
                in self.__fields.items()
                if get_field is not None
            },
        )
