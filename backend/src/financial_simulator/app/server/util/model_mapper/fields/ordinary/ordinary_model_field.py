from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.fields.ordinary.ordinary_get_field import OrdinaryGetField
from financial_simulator.app.server.util.model_mapper.fields.ordinary.ordinary_post_field import OrdinaryPostField
from financial_simulator.app.server.util.model_mapper.types import (
    POST,
    TABLE,
    GET,
)


class OrdinaryModelField(ModelField[TABLE, GET, POST]):
    def __init__(self) -> None:
        super().__init__(
            get_field=OrdinaryGetField[TABLE, GET](),
            post_field=OrdinaryPostField[TABLE, POST](),
        )
