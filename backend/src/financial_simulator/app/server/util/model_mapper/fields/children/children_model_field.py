from typing import Generic

from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.fields.children.children_get_field import \
    ChildrenGetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
    GetMapperInterface,
)


class ChildrenModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET]):
    def __init__(self, get_mapper: GetMapperInterface[RELATED_TABLE, RELATED_GET] | None = None) -> None:
        super().__init__(
            get_field=ChildrenGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](get_mapper),
        )
