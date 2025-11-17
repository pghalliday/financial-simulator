from typing import Generic

from financial_simulator.app.server.util.model_mapper.fields.children.children_post_field import ChildrenPostField
from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.fields.children.children_get_field import \
    ChildrenGetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
    RELATED_POST,
    ModelMapperInterface,
    GetMapperInterface,
)


class ChildrenModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET]):
    def __init__(
            self,
            param: ModelMapperInterface[RELATED_TABLE, RELATED_GET, RELATED_POST] |
                   GetMapperInterface[RELATED_TABLE, RELATED_GET] |
                   bool |
                   None = None
    ) -> None:
        if isinstance(param, ModelMapperInterface):
            super().__init__(
                get_field=ChildrenGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](param.get_mapper),
                post_field=ChildrenPostField[TABLE, POST, RELATED_TABLE, RELATED_POST](param.post_mapper),
            )
        elif isinstance(param, GetMapperInterface):
            super().__init__(
                get_field=ChildrenGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](param),
            )
        elif param:
            super().__init__(
                get_field=ChildrenGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](),
                post_field=ChildrenPostField[TABLE, POST, RELATED_TABLE, RELATED_POST](),
            )
        else:
            super().__init__(
                get_field=ChildrenGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](),
            )
