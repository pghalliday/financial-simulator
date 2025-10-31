from typing import Any

from sqlalchemy.orm import Session

from financial_simulator.app.server.util import (
    get_related_item,
)
from financial_simulator.app.server.util.model_mapper.fields.patch_field import PatchField
from financial_simulator.app.server.util.model_mapper.types import TABLE, FieldRelation


class RelatedPatchField(PatchField[TABLE]):
    __field_relation: FieldRelation

    def __init__(self, field_relation: FieldRelation):
        self.__field_relation = field_relation

    def map(self, field: str, session: Session, item: TABLE, model: type[TABLE], value: Any) -> None:
        setattr(item, self.__field_relation.field, get_related_item(
            session,
            self.__field_relation.model,
            self.__field_relation.field,
            value,
        ))

    def has_invalid_relation_error(self) -> bool:
        return True
