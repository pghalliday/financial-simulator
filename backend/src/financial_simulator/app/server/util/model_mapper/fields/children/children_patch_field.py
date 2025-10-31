import logging
from typing import Generic, Sequence

from sqlalchemy.orm import Session

from financial_simulator.app.server.util import get_related_item
from financial_simulator.app.server.util.model_mapper.fields.patch_field import PatchField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    RELATED_TABLE,
)
from .child_reference import ChildReference

logger = logging.getLogger(__name__)


class ChildrenPatchField(PatchField[TABLE], Generic[TABLE, RELATED_TABLE]):
    __model: type[RELATED_TABLE] | None

    def __init__(self, model: type[RELATED_TABLE] | None = None) -> None:
        self.__model = model

    def map(self, field: str, session: Session, item: TABLE, model: type[TABLE], value: Sequence[ChildReference]) -> None:
        model = self.__model or model
        setattr(item, field, [
            get_related_item(
                session,
                model,
                field,
                child_reference.id,
            )
            for child_reference in value
        ])

    def has_invalid_relation_error(self) -> bool:
        return True

