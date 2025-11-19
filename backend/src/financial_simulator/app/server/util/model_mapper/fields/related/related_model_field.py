from ..model_field import ModelField
from ..ordinary import OrdinaryGetField
from financial_simulator.app.server.util.model_mapper.fields.related.related_post_field import RelatedPostField
from financial_simulator.app.server.util.model_mapper.type_vars import (
    TABLE,
    POST,
    GET,
)


class RelatedModelField(ModelField[TABLE, GET, POST]):
    def __init__(self, field: str, model: type[TABLE]) -> None:
        super().__init__(
            get_field=OrdinaryGetField[TABLE, GET](),
            post_field=RelatedPostField[TABLE, POST](field, model),
        )
