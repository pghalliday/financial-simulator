from typing import Generic

from ..model_field import ModelField
from ...type_vars import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
    NAMED_ASSOCIATION_TABLE,
)
from .named_association_get_field import NamedAssociationGetField
from .named_association_post_field import NamedAssociationPostField
from ...get_mapper import GetMapper


class NamedAssociationModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET, NAMED_ASSOCIATION_TABLE]):
    def __init__(self, association_field: str, get_mapper: GetMapper[RELATED_TABLE, RELATED_GET], association_model: type[NAMED_ASSOCIATION_TABLE] | None = None) -> None:
        if association_model is not None:
            super().__init__(
                get_field=NamedAssociationGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](association_field, get_mapper),
                post_field=NamedAssociationPostField[TABLE, POST, RELATED_TABLE, NAMED_ASSOCIATION_TABLE](association_model, association_field, get_mapper.table_model),
            )
        else:
            super().__init__(
                get_field=NamedAssociationGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](association_field, get_mapper),
            )
