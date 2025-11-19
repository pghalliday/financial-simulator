from dataclasses import dataclass
from typing import Generic

from financial_simulator.app.server.util.model_mapper.fields.model_field import ModelField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    POST,
    GET,
    RELATED_TABLE,
    RELATED_GET,
    GetMapperInterface,
    ASSOCIATION_TABLE,
)
from .association_get_field import AssociationGetField
from .association_post_field import AssociationPostField


@dataclass(frozen=True)
class AssociationModelFieldParams(Generic[RELATED_TABLE, RELATED_GET, ASSOCIATION_TABLE]):
    association_model: type[ASSOCIATION_TABLE] | None = None
    get_mapper: GetMapperInterface[RELATED_TABLE, RELATED_GET] | None = None


class AssociationModelField(ModelField[TABLE, POST, GET], Generic[TABLE, POST, GET, RELATED_TABLE, RELATED_GET, ASSOCIATION_TABLE]):
    def __init__(self, association_field: str, params: AssociationModelFieldParams[RELATED_TABLE, RELATED_GET, ASSOCIATION_TABLE] | None = None) -> None:
        if params is not None:
            if params.association_model is not None:
                model = params.get_mapper and params.get_mapper.table_model
                super().__init__(
                    get_field=AssociationGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](association_field, params.get_mapper),
                    post_field=AssociationPostField[TABLE, POST, RELATED_TABLE, ASSOCIATION_TABLE](params.association_model, association_field, model),
                )
            else:
                super().__init__(
                    get_field=AssociationGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](association_field, params.get_mapper),
                )
        else:
            super().__init__(
                get_field=AssociationGetField[TABLE, GET, RELATED_TABLE, RELATED_GET](association_field)
            )
