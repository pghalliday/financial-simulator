from typing import Generic


from .get_field import GetField
from .post_field import PostField
from ..type_vars import (
    POST,
    TABLE,
    GET,
)


class ModelField(Generic[TABLE, GET, POST]):
    get_field: GetField[TABLE, GET]
    post_field: PostField[TABLE, POST] | None

    def __init__(
            self,
            get_field: GetField[TABLE, GET],
            post_field: PostField[TABLE, POST] | None = None,
    ):
        self.get_field = get_field
        self.post_field = post_field

    def has_invalid_relation_error(self) -> bool:
        result = False
        if self.post_field is not None:
            result = result or self.post_field.has_invalid_relation_error()
        return result
