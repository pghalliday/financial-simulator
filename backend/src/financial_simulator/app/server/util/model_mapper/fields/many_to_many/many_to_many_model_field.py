from dataclasses import dataclass
from typing import Generic

from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
    GetMapperInterface,
)
from .many_to_many_get_field import ManyToManyGetField
from .many_to_many_post_field import ManyToManyPostField


@dataclass(frozen=True)
class ManyToManyModelFieldParams(Generic[RELATED_TABLE, RELATED_GET]):
    include_post: bool = False
    get_mapper: GetMapperInterface[RELATED_TABLE, RELATED_GET] | None = None


class ManyToManyModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET]):
    def __init__(self, params: ManyToManyModelFieldParams[RELATED_TABLE, RELATED_GET] | None = None) -> None:
        if params is not None:
            if params.include_post:
                model = params.get_mapper and params.get_mapper.table_model
                super().__init__(
                    get_field=ManyToManyGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](params.get_mapper),
                    post_field=ManyToManyPostField[TABLE, POST, RELATED_TABLE](model),
                )
            else:
                super().__init__(
                    get_field=ManyToManyGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](params.get_mapper),
                )
        else:
            super().__init__(
                get_field=ManyToManyGetField[TABLE, GET, RELATED_TABLE, RELATED_GET]()
            )
