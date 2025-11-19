from typing import Generic

from ...get_mapper import GetMapper
from ..model_field import ModelField
from .parent_get_field import ParentGetField
from ...type_vars import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
)


class ParentModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET]):
    def __init__(self, get_mapper: GetMapper[RELATED_TABLE, RELATED_GET]) -> None:
        super().__init__(
            get_field=ParentGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](get_mapper),
        )
