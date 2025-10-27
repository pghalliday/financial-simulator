from typing import Generic, Optional


from financial_simulator.app.server.util.model_mapper.fields.get_field import GetField
from financial_simulator.app.server.util.model_mapper.fields.patch_field import PatchField
from financial_simulator.app.server.util.model_mapper.fields.post_field import PostField
from financial_simulator.app.server.util.model_mapper.types import (
    POST,
    TABLE,
    GET,
)


class ModelField(Generic[TABLE, GET, POST]):
    get_field: Optional[GetField[TABLE, GET]]
    post_field: Optional[PostField[TABLE, POST]]
    patch_field: Optional[PatchField[TABLE]]

    def __init__(
            self,
            get_field: Optional[GetField[TABLE, GET]]=None,
            post_field: Optional[PostField[TABLE, POST]]=None,
            patch_field: Optional[PatchField[TABLE]]=None
    ):
        self.get_field = get_field
        self.post_field = post_field
        self.patch_field = patch_field

    def has_invalid_relation_error(self) -> bool:
        result = False
        if self.post_field is not None:
            result = result or self.post_field.has_invalid_relation_error()
        if self.patch_field is not None:
            result = result or self.patch_field.has_invalid_relation_error()
        return result
