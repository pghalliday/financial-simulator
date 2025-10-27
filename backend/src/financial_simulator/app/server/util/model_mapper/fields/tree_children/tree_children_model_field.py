from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.fields.tree_children.tree_children_get_field import \
    TreeChildrenGetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    GET,
)


class TreeChildrenModelField(ModelField[TABLE, POST, GET]):
    def __init__(self) -> None:
        super().__init__(
            get_field=TreeChildrenGetField[TABLE, GET](),
        )
