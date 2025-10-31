from typing import Generic

from financial_simulator.app.server.util.model_mapper.fields.children.children_patch_field import ChildrenPatchField
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
    ChildrenModelFieldParams,
)

class ChildrenModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET]):
    def __init__(self, params: ChildrenModelFieldParams[RELATED_TABLE, RELATED_GET] | None = None) -> None:
        if params is not None:
            if params.include_post_and_patch:
                model = params.get_mapper and params.get_mapper.table_model
                super().__init__(
                    get_field=ChildrenGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](params.get_mapper),
                    post_field=ChildrenPostField[TABLE, POST, RELATED_TABLE](model),
                    patch_field=ChildrenPatchField[TABLE, RELATED_TABLE](model),
                )
            else:
                super().__init__(
                    get_field=ChildrenGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](params.get_mapper),
                )
        else:
            super().__init__(
                get_field=ChildrenGetField[TABLE, GET, RELATED_TABLE, RELATED_GET]()
            )
