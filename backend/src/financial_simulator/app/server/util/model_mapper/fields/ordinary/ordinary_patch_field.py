from typing import Any

from sqlalchemy.orm import Session

from financial_simulator.app.server.util.model_mapper.fields.patch_field import PatchField
from financial_simulator.app.server.util.model_mapper.types import TABLE


class OrdinaryPatchField(PatchField[TABLE]):
    def map(self, field: str, session: Session, item: TABLE, value: Any) -> None:
        setattr(item, field, value)

    def has_invalid_relation_error(self) -> bool:
        return False
