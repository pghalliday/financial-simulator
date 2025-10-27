from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.fields.tree_parent.tree_parent_get_field import TreeParentGetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    GET,
)


class TreeParentModelField(ModelField[TABLE, POST, GET]):
    def __init__(self) -> None:
        super().__init__(
            get_field=TreeParentGetField[TABLE, GET](),
        )
