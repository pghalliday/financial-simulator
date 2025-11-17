from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.fields.ordinary.ordinary_get_field import OrdinaryGetField
from financial_simulator.app.server.util.model_mapper.fields.related.related_post_field import RelatedPostField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    GET,
    FieldRelation,
)


class RelatedModelField(ModelField[TABLE, GET, POST]):
    def __init__(self, field_relation: FieldRelation) -> None:
        super().__init__(
            get_field=OrdinaryGetField[TABLE, GET](),
            post_field=RelatedPostField[TABLE, POST](field_relation),
        )
