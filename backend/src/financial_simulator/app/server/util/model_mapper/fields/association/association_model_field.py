from typing import Generic

from ..model_field import ModelField
from ...type_vars import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
    ASSOCIATION_TABLE,
)
from .association_get_field import AssociationGetField
from .association_post_field import AssociationPostField
from ...get_mapper import GetMapper


class AssociationModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET, ASSOCIATION_TABLE]):
    def __init__(self, association_field: str, get_mapper: GetMapper[RELATED_TABLE, RELATED_GET], association_model: type[ASSOCIATION_TABLE] | None = None) -> None:
        if association_model is not None:
            super().__init__(
                get_field=AssociationGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](association_field, get_mapper),
                post_field=AssociationPostField[TABLE, POST, RELATED_TABLE, ASSOCIATION_TABLE](association_model, association_field, get_mapper.table_model),
            )
        else:
            super().__init__(
                get_field=AssociationGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](association_field, get_mapper),
            )
