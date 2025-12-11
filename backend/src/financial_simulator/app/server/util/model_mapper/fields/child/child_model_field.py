from typing import Generic

from ...get_mapper import GetMapper
from ...post_mapper import PostMapper
from .child_post_field import ChildPostField
from ..model_field import ModelField
from .child_get_field import ChildGetField
from ...type_vars import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
    RELATED_POST,
)


class ChildModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET]):
    def __init__(
            self,
            get_mapper: GetMapper[RELATED_TABLE, RELATED_GET],
            post_mapper: PostMapper[RELATED_TABLE, RELATED_POST] | None = None
    ) -> None:
        if post_mapper is not None:
            super().__init__(
                get_field=ChildGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](get_mapper),
                post_field=ChildPostField[TABLE, POST, RELATED_TABLE, RELATED_POST](post_mapper),
            )
        else:
            super().__init__(
                get_field=ChildGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](get_mapper),
            )
