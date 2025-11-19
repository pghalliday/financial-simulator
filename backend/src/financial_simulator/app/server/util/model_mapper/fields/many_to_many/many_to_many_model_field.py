from typing import Generic

from ..model_field import ModelField
from ...type_vars import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
)
from .many_to_many_get_field import ManyToManyGetField
from .many_to_many_post_field import ManyToManyPostField
from ...get_mapper import GetMapper


class ManyToManyModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET]):
    def __init__(self, get_mapper: GetMapper[RELATED_TABLE, RELATED_GET], include_post: bool = False) -> None:
        if include_post:
            super().__init__(
                get_field=ManyToManyGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](get_mapper),
                post_field=ManyToManyPostField[TABLE, POST, RELATED_TABLE](get_mapper.table_model),
            )
        else:
            super().__init__(
                get_field=ManyToManyGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](get_mapper),
            )
